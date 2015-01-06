// BaseNetVisModel contains common elements shared among all the NetVis models
// NetVis.nodes, NetVis.messages, NetVis.history inherit from BaseNetVisModel

BaseNetVisModel = function() {
	var self = this;
	self._asObject = {}; // used to store info on nodes
	self.asArray = []; // array of node's data mirrors _asObject data, connected to d3 canvas
	self.load = function(srcObject, assignID) {
		// loadNode updates nodesModel with node data read off srcObject
		// e.g. loadNode({'id':'ff34', 'name':'Node34'})
		// returns created object if success, error string if failed
		if (!srcObject.id && assignID) {
			srcObject.id = assignID;
		}

		if (!srcObject.id) {
			return 'BaseNetVisModel.load() no ID provided';
		} 
		if (self._asObject[srcObject.id]) {
			// instance already exists
			return self._asObject[srcObject.id];
		}

		self._asObject[srcObject.id] = srcObject;
		self.asArray.push(srcObject);
		return srcObject;
	};
};/////////////////////////////////////////////////////////////// Define history model and handlers


NetVis.prototype._constructNetVisHistory = function() {
	var self = this;
	self.history = new BaseNetVisModel(this); // History class inherits from baseModel

	self.history.loadEvent = function(obj, momentTime) {
		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		var i=1;
		obj.id = obj.time;
		while(this._asObject[obj.id]){
			i++;
			obj.id = obj.time + "#" + i;
		}
		obj.id = obj.time;
		this._asObject[obj.id] = obj;


		// insert event so that asArray is sorted
		// with binary search for appropriate position
		var cur = 0,
			lowI = 0,
			highI = this.asArray.length;
		while (lowI < highI) {
			cur = Math.floor((highI + lowI) /2);
			if (this.asArray[cur]._t.isBefore(obj._t)) {
				lowI = cur + 1;
			} else {
				highI = cur;
			}
		}
		this.asArray.splice(Math.floor((highI + lowI) /2), 0,obj);
	};


	self.history.updateAll = function() {
		// create interval instances from events array
		if (!this.asArray) {
			// no events or not initialized
			return;
		}
		this.intervals = [];
		var curInterval = 0;

		// sorting all the events by happenning at the same timestamps
		// and making time interval instances
		cur = 0;
		startEvents = [this.asArray[cur]];
		cur ++;
		while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(startEvents[0]._t)) {
			startEvents.push(this.asArray[cur]);
			cur++;
		}

		// traversing all simultanious events into events for interval boundaries
		while (cur < this.asArray.length) {
			finishEvents =[this.asArray[cur]];
			cur++;
			while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(finishEvents[0]._t)) {
				finishEvents.push(this.asArray[cur]);
				cur++;
			}

			curInterval = new NetVisInterval(startEvents, finishEvents, curInterval);
			if (this.intervals.length === 0) {
				for(var i=0; i< self.Nodes.asArray.length; i++) {
					if (self.Nodes.asArray[i].permanentNode) {
						curInterval.nodes.push(self.Nodes.asArray[i]);
					}
				}
			}
			this.intervals.push(curInterval);
			startEvents = finishEvents;
		}


		if (this.intervals) {
			this.selectedTimeInterval = this.intervals[0];
		}
	};


	// add default time margin moments
	self.history.loadEvent({"tag":"end"},moment("3000-01-01"));
	self.history.loadEvent({"tag":"start"},moment("1970-01-01"));
	self.history.updateAll();


};
/////////////////////////////////////////////////////////////// Define time interval model



NetVisInterval = function(startEvents, endEvents, prevInterval) {
	this.startEvents = startEvents;
	this.endEvents = endEvents;
	this._starts = startEvents[0]._t; // as momentjs object
	this._ends = endEvents[0]._t; // as momentjs object
	this.starts = this._starts.toISOString(); // as ISO timestamp
	this.ends = this._ends.toISOString();

	if (prevInterval) {
		this.messages = prevInterval.messages.slice(0); // js way of copying array instance
		this.nodes = 	prevInterval.nodes.slice(0);
	} else {
		this.messages = [];
		this.nodes = [];
	}

	for(var i=0; i< this.startEvents.length; i++) {
		var event = this.startEvents[i];
		switch (event.event) {
			case "nodeEntered":
				this.nodes.push(event.node);
				break;
			case "nodeExited":
				for(var j = this.nodes.length - 1; j >= 0; j--) {
					// if(this.nodes[j].id === event.node.id) {
					// 	this.nodes.splice(j, 1);
					// }
				}
				break;
			case "messageSent":
				this.messages.push(event.message);
				break;
			case "messageReceived":
				for(var h = this.messages.length - 1; h >= 0; h--) {
				    if(this.messages[h].id === event.message.id) {
				       this.messages.splice(h, 1);
				    }
				}
		}
	}
};
/////////////////////////////////////////////////////////////// NetVis.Messages handles network's messages that nodes communicate with


NetVisMessages = function() {
	var self = this;
	BaseNetVisModel.apply(self); // Messages class inherits from baseModel

	self.updateAll = function() {
		for (var i=0; i< self.asArray.length; i++) {
			self.asArray[i]._p = Math.random(); // _p goes from 0 to 100 to animate message direction
		}
	};
};/////////////////////////////////////////////////////////////// Define network node model and handlers

NetVisNodes = function() {
	var self = this;
	BaseNetVisModel.apply(self); // Nodes class inherits from baseModel

	superLoad = self.load;
	self.load = function(srcObject, assignID) {
		// if a new node instance and "permanentNode" is not false, will make the
		if (srcObject.id && !self._asObject[srcObject.id]) {
			if (typeof srcObject.permanentNode === 'undefined') {
				srcObject.permanentNode = true;
			}
			return superLoad(srcObject, assignID);
		}
	};

	self.updateAll = function() {
		// generate default node's positioning coordinates on canvas
		if (self.asArray.length === 0) {
			// when no nodes loaded, computing arc variable would involve dividing by zero
			return;
		}
		var	arc = 2 * Math.PI / self.asArray.length;
		for (var i=0; i< self.asArray.length; i++) {
			self.asArray[i]._x = 0.5 + 0.3 * Math.sin(i*arc);
			self.asArray[i]._y = 0.5 - 0.3 * Math.cos(i*arc);
		}
	};

	self.resetPositions = function() {
		for (var i=0; i< self.asArray.length; i++) {
			delete self.asArray[i]._xAbs;
			delete self.asArray[i]._yAbs;
		}
	};
};
/////////////////////////////////////////////////////////////// NetVis defines global object NetVis that wraps up everything else

// constructor for NetVis class
function NetVis(Options) {
	var self = this;
	self._topologyPanel = Options.topologyPanel || "#chart";
	self._historyPanel = Options.historyPanel || "#history";
	self._timePanel = Options.timePanel || "#timestamp";
	self.playmode = true;

	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Nodes = new NetVisNodes();
	self.messages = new NetVisMessages();
	self._constructNetVisHistory();
	self.View = new NetVisView();
	self._selected = self; // _selected object's public attributes are shown at properties-table


	self.resetPositions = function() {
		self.Nodes.resetPositions();
		self._selected = self;
		self.render();
	};


	self.updateAll = function() {
		this.Nodes.updateAll();
		this.messages.updateAll();
		this.history.updateAll();

		if (this.history.intervals) {
			this.selectedTimeInterval = this.history.intervals[0];
		}
	};

	self.play = function() {
		self.playmode = !self.playmode;
		self.render();
	};
}


// NetVis can be imported as node.js module
// (currently used for testing)
if (typeof module != 'undefined') {
	module.exports = {
		NetVis: NetVis
	};
}
/////////////////////////////////////////////////////////////// parse deserializes network trace files in NetVis format

NetVis.prototype.parse = function(srcJSON) {
	// jsonAdapter loads JSON in NetVis format

	if (typeof(srcJSON) !== 'object') {
		return 'srcJSON needs to be a JSON object';
	}

	for (var i=0; i< srcJSON.length; i++) {
		if (typeof(srcJSON[i]) !== 'object') {
			console.log("failing to parse event:",srcJSON[i]);
			continue;
		}

		switch (srcJSON[i].event) {
			case "nodeEntered":
				this._parseNodeEntered(srcJSON[i]);
				break;
			case "nodeExited":
					this._parseNodeExited(srcJSON[i]);
					break;
			case "messageSent":
				this._parseMessageSent(srcJSON[i]);
				break;
			case "messageReceived":
				this._parseMessageReceived(srcJSON[i]);
				break;
			default:
				console.log("Event type ",srcJSON[i].event, " not supported");
		}

	}

	this.updateAll();
};
/////////////////////////////////////////////////////////////// parseMessageReceived.js

NetVis.prototype._parseMessageReceived = function(src) {
	// sanity check validation
	// check if loggerID node was initialized
	if (!src.loggerID || !src.destinationNode){
		return 'parseMessageSent() no logger ID or destinationNode ID provided, too broken';
	}

	var r = this.messages.load(src.message, src.message.request_id);
	if (typeof(r) === "string") {
		console.log('no luck with ', r);
		return r;
	}

	src.message = r;
	var e = this.history.loadEvent(src, moment(src.time));

	return r;
};

/////////////////////////////////////////////////////////////// parseMessage.js

NetVis.prototype._parseMessageSent = function(src) {
	// sanity check validation
	// check if loggerID node was initialized
	if (!src.loggerID || !src.destinationNode){
		return 'parseMessageSent() no logger ID or destinationNode ID provided, too broken';
	}

	var r = this.messages.load(src.message, src.message.request_id);
	if (typeof(r) === "string") {
		console.log('no luck with ', r);
		return r;
	}

	this.Nodes.load({"id":src.loggerID});
	r.source = this.Nodes._asObject[src.loggerID];


	this.Nodes.load({"id":src.destinationNode});
	r.destination = this.Nodes._asObject[src.destinationNode];

	src.message = r;
	var e = this.history.loadEvent(src, moment(src.time));

	return r;
};

/////////////////////////////////////////////////////////////// parse NodeEntered event

NetVis.prototype._parseNodeEntered = function(src) {
  var r = this.Nodes.load({
    "id": src.name,
    "permanentNode": false
  });

  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
/////////////////////////////////////////////////////////////// parse NodeExited event

NetVis.prototype._parseNodeExited = function(src) {
  var r = this.Nodes.load({
    "id": src.name
  });
  console.log("parseNodeExited reports node: ", r, " from event record: ", src);
  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
/////////////////////////////////////////////////////////////// view/message.js
// Defines render() function for messages /////////////////////////////////////////////////////////////// view.js defines Netvis.view

function NetVisView() {
	$('.alert .close').on('click', function(e) {
	    $(this).parent().hide();
	});
	this.Logger = {
		"error": function(errorMessage) {
			console.error(errorMessage);
			$('.error-alert').append("<p>"+ errorMessage +"</p>");
			$('.error-alert').show();
		},
		"info": function(logMessage) {
			console.log(logMessage);
		}
	};
}

NetVis.prototype.initView = function() {
	var self = this;
     // Render time-controls panel
     $("#history")
     	.attr("min",1)
     	.attr("max",this.history.intervals.length)
     	.val(1);

     $('#history').rangeslider('destroy');
     $('#history').rangeslider({
       polyfill: false,
       onSlideEnd: function(position, value) {
       	self.selectedTimeInterval = self.history.intervals[value -1];
       	self._selected = self.selectedTimeInterval;
       	$('#timestamp').html(value);
		self.render();
       }
     });


     self.render();
};



NetVis.prototype.render = function() {
	var self = this;
	var width = $(self._topologyPanel).width();

	self.Nodes.asArray.forEach(function(el) {
		    	if (!el._xAbs) {
		    		el._xAbs = el._x*width;
			    }
		    	if (!el._yAbs) {
			    	el._yAbs = el._y*width;
		    	}
	});



	$(self._topologyPanel).empty();
	canvas = d3.select(self._topologyPanel)
		.append("svg")
		.attr("width",$(self._topologyPanel).width())
		.attr("height",$(self._topologyPanel).height());

	// Draw the big grey circle in the center
	canvas.append("circle")
		.attr("cx", 0.5*width)
		.attr("cy", 0.5*width)
		.attr("r", 0.3*width)
		.attr("class", "contour");


	messages = canvas.selectAll('line.message').data(self.selectedTimeInterval.messages)
		.enter().append('line')
		.on("click",function(d) { self._selected = d; self.render();})
		.attr('class','message');

	messagesAnimation = canvas.selectAll('line.messageAnimation').data(self.selectedTimeInterval.messages)
		.enter().append('line')
		.on("click",function(d) { self._selected = d; self.render();})
		.attr('class','messageAnimation');

	nodes = canvas.selectAll("circle.node").data(self.selectedTimeInterval.nodes)
		.enter().append("circle")
	    .on("click",function(d) { self._selected = d; self.render();})
	    .attr('class','node');

	syncPositions = function() {
		messages
		    .attr("x1", function(d) {return d.source._xAbs;})
		    .attr("y1", function(d) {return d.source._yAbs;})
		    .attr("x2", function(d) {return d.destination._xAbs;})
		    .attr("y2", function(d) {return d.destination._yAbs;});

		messagesAnimation
		    .attr("x1", function(d) {return d.source._xAbs;})
		    .attr("y1", function(d) {return d.source._yAbs;})
		    .attr("x2", function(d) {return d.source._xAbs + d._p*(d.destination._xAbs - d.source._xAbs);})
		    .attr("y2", function(d) {return d.source._yAbs + d._p*(d.destination._yAbs - d.source._yAbs);});


		return	nodes
		    .attr("cx", function(d) {return d._xAbs;})
		    .attr("cy", function(d) {return d._yAbs;});
	};

	d3.timer.flush();
    d3.timer(function() {
     	self.messages.asArray.forEach(function(el){
     		el._p = (el._p + 0.001) % 1.0;
     	});
     	syncPositions();
     });

	syncPositions()
	    .attr("r",self.config.nodeDefaultRadius)
	    .call(d3.behavior.drag()
	      .on("dragstart", function(d) {
	        this.__origin__ = [d._xAbs, d._yAbs];
	      })
	      .on("drag", function(d) {
	        d._xAbs = Math.min(width, Math.max(0, this.__origin__[0] += d3.event.dx));
	        d._yAbs = Math.min(width, Math.max(0, this.__origin__[1] += d3.event.dy));
	        syncPositions();
	      })
	      .on("dragend", function() {
	        delete this.__origin__;
	      }));



	// highlight selected node
	nodes.filter(function(d) {return self._selected.id === d.id;})
		.attr('class','node selected')
	    .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
		.attr("r",2*self.config.nodeDefaultRadius);

	// highlight selected message
	messages.filter(function(d) {return self._selected.id === d.id;})
	    .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
		.attr('class','message selected');



	// Render properties-table
	$("#properties-tbody").empty();
	attributes = [];
	for (var key in self._selected) {
	   if (!self._selected.hasOwnProperty(key)) {
	   	// inherited attribute, ignoring
	   	continue;
	   }
	   if (typeof(self._selected[key]) == "function") {
	   	// attribute is a function, ignoring
	   	continue;
	   }
	   if (key.charAt(0) === "_") {
	   	// private attribute, ignoring
	   	continue;
	   }
	   attributes.push({"attr": key, "value":self._selected[key], "obj": typeof(self._selected[key]) == "object"});
	}

    rows = d3.select("#properties-tbody").selectAll("tr").data(attributes).enter().append("tr");

    rows.append("td").text(function(d) {return d.attr; });

    rows.filter(function(d) {return !d.obj;})
        .append("td")
        .append("div")
        .attr("class","properties-column")
        .text(function(d) {return d.value; });

    rows.filter(function(d) {return d.obj;}).append("td").append("a").text(function(d) {return "more.."; })
        .on("click", function(d) {self._selected = d.value; self.render();});


};
