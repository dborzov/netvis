// BaseNetVisModel contains common elements shared among all the NetVis models
// NetVis.nodes, NetVis.messages, NetVis.history inherit from BaseNetVisModel

BaseNetVisModel = function(root, label) {
	var self = this;
	self._asObject = {}; // used to store info on nodes

	self._propertiesAlias = self._asObject;
	self._root = root;
	self._label = label;

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

		// assign graph labels
		srcObject._root = self;
		srcObject._label = srcObject.id;
		self._asObject[srcObject.id] = srcObject;
		self.asArray.push(srcObject);
		return srcObject;
	};
};
/////////////////////////////////////////////////////////////// NetVis.connections handles network's connections between nodes

NetVis.prototype._constructConnections = function() {
    this.connections = new BaseNetVisModel(this, "connections");
};
/////////////////////////////////////////////////////////////// Define history model and handlers


NetVis.prototype._constructHistory = function() {
	var self = this;
	self.history = new BaseNetVisModel(self, "timeline"); // History class inherits from baseModel

	self.history.loadEvent = function(obj, momentTime) {
		obj._root = self.history;

		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		var i=1;
		obj.id = obj.time;
		while(this._asObject[obj.id]){
			i++;
			obj.id = obj.time + "#" + i + "(" + obj.event + ")";
		}
		obj.id = obj.time  + "(" + obj.event + ")";
		obj._label = obj.id;
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
		return obj;
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
				for(var i=0; i< self.nodes.asArray.length; i++) {
					if (self.nodes.asArray[i].permanentNode) {
						curInterval.nodes.push(self.nodes.asArray[i]);
					}
				}
			}
			curInterval.i = this.intervals.length; // store position index to assign timeline slider to the corresponding position
			curInterval._root = this;
			curInterval._label = "interval " + this.intervals.length;
			this.intervals.push(curInterval);
			startEvents = finishEvents;
		}


		// build doubly linked list for time intervals
		for (var j=0; j< this.intervals.length -1; j++) {

			this.intervals[j].next = this.intervals[j+1];
			this.intervals[j+1].prev = this.intervals[j];
		}

		// change human readable timestamp for the last time interval
		if (this.intervals.length) {
			this.intervals[this.intervals.length -1].humanTimeLabel = "At "  + this.intervals[this.intervals.length -1]._starts.format("dddd, MMMM Do YYYY, h:mm:ss a");
		}

	};





	self.history.next = function() {
		if (self._selectedTimeInterval) {
			if (self._selectedTimeInterval.next) {
				self._selectedTimeInterval = self._selectedTimeInterval.next;
			} else {
				// reached the end og the timeline, loop to beginning if repeat mode on
				if (self.config.loopPlay) {
					self._selectedTimeInterval = this.intervals[0];
				} else {
					self.play(); // toggle off the play mode
				}
			}
		}
	};

	self.history.prev = function() {
		if (!self._selectedTimeInterval) {
			return;
		}
		if (self._selectedTimeInterval.prev) {
			self._selectedTimeInterval = self._selectedTimeInterval.prev;
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
		this.messages = prevInterval.messages.slice(0); // js way of copying an array
		this.nodes = 	prevInterval.nodes.slice(0);
		this.connections = prevInterval.connections.slice(0);
		this.humanTimeLabel = this._starts.format("dddd, MMMM Do YYYY, h:mm:ss a") + " + " + this._ends.from(this._starts, true);

	} else {
		this.humanTimeLabel = "At " + this._ends.format("dddd, MMMM Do YYYY, h:mm:ss a");
		this.messages = [];
		this.nodes = [];
		this.connections = [];
	}

	for(var i=0; i< this.startEvents.length; i++) {
		var event = this.startEvents[i];
		switch (event.event) {
			case "nodeEntered":
				this.nodes.push(event.node);
				break;
			case "nodeExited":
				for(var j = this.nodes.length - 1; j >= 0; j--) {
					if(this.nodes[j].id === event.node.id) {
						this.nodes.splice(j, 1);
					}
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
				break;
			case "nodeConnected":
				this.connections.push(event.connection);
				break;
		}
	}
};
/////////////////////////////////////////////////////////////// NetVis.Messages handles network's messages that nodes communicate with

NetVis.prototype._constructMessages = function() {
	var self = this;
	self.messages = new BaseNetVisModel(self, "messages"); // Messages class inherits from baseModel

	self.messages.updateAll = function() {
		for (var i=0; i< this.asArray.length; i++) {
			this.asArray[i]._p = Math.random(); // _p goes from 0 to 100 to animate message direction
		}
	};
};
/////////////////////////////////////////////////////////////// Define network node model and handlers

NetVis.prototype._constructNodes = function() {
	var self = this;

	self.nodes = new BaseNetVisModel(self, "nodes"); // nodes class inherits from baseModel


	superLoad = self.nodes.load;
	self.nodes.load = function(srcObject, assignID) {
		// if a new node instance and "permanentNode" is not false, will make the
		if (srcObject.id && self.nodes._asObject[srcObject.id]) {
			return self.nodes._asObject[srcObject.id];
		}

		if (srcObject.id && typeof srcObject.permanentNode === 'undefined') {
				srcObject.permanentNode = true;
		}
		return superLoad(srcObject, assignID);
	};

	self.nodes.updateAll = function() {
		// generate default node's positioning coordinates on canvas
		if (self.nodes.asArray.length === 0) {
			// when no nodes loaded, computing arc variable would involve dividing by zero
			return;
		}
		var	arc = 2 * Math.PI / self.nodes.asArray.length;
		for (var i=0; i< self.nodes.asArray.length; i++) {
			self.nodes.asArray[i]._x = 0.5 + 0.3 * Math.sin(i*arc);
			self.nodes.asArray[i]._y = 0.5 - 0.3 * Math.cos(i*arc);
		}
	};

	self.nodes.resetPositions = function() {
		for (var i=0; i< self.nodes.asArray.length; i++) {
			delete self.nodes.asArray[i]._xAbs;
			delete self.nodes.asArray[i]._yAbs;
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
	self._playmode = false;

	self.config = {
		_root: self,
		_label: "configuration",
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10,
		loopPlay: false
	};

	self._constructNodes(); // constructor for self.nodes
	self._constructMessages(); // constructor for self.messages
	self._constructConnections(); // constructor for self.connections
	self._constructHistory(); // constructor for self.history
  self._constructLogger();
	self._selected = self; // _selected object's public attributes are shown at properties-table


	self.resetPositions = function() {
		self.nodes.resetPositions();
		self._selected = self;
		self.render();
	};


	self.updateAll = function() {
		this.nodes.updateAll();
		this.messages.updateAll();
		this.history.updateAll();

		if (this.history.intervals) {
			this._selectedTimeInterval = this.history.intervals[0];
		}
	};

	self.play = function() {
		self._playmode = !self._playmode;
		if (self._playmode) {
			self._playTicker = window.setInterval(function() {
				self.history.next();
				self.render();
			}, 800);
		} else {
			window.clearInterval(self._playTicker); // clear play ticking timer
		}
		self.render();
	};

	self.next = function() {
		self.history.next();
		self.render();
	};

	self.prev = function() {
		self.history.prev();
		self.render();
	};

	self.loopPlay = function() {
		self.config.loopPlay = !self.config.loopPlay;
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
			case "nodeConnected":
				this._parseNodeConnected(srcJSON[i]);
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

	this.nodes.load({"id":src.loggerID});
	r.source = this.nodes._asObject[src.loggerID];


	this.nodes.load({"id":src.destinationNode});
	r.destination = this.nodes._asObject[src.destinationNode];

	src.message = r;
	var e = this.history.loadEvent(src, moment(src.time));

	return r;
};

/////////////////////////////////////////////////////////////// parse nodeConnected event

NetVis.prototype._parseNodeConnected = function(src) {
    var r = this.connections.load({
      "connectingNode": src.connectingNode,
      "dialedNode":src.dialedNode
    }, src.connectingNode + ":" + src.dialedNode);
    r.connectingNode = this.nodes.load({"id":src.connectingNode});
    r.dialedNode = this.nodes.load({"id":src.dialedNode});

    var e = this.history.loadEvent(src, moment(src.time));
    e.connection = r;
    return e;
};
/////////////////////////////////////////////////////////////// parse NodeEntered event

NetVis.prototype._parseNodeEntered = function(src) {
  var r = this.nodes.load({
    "id": src.name,
    "permanentNode": false
  });

  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
/////////////////////////////////////////////////////////////// parse NodeExited event

NetVis.prototype._parseNodeExited = function(src) {
  var r = this.nodes.load({
    "id": src.name
  });
  console.log("parseNodeExited reports node: ", r, " from event record: ", src);
  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
/////////////////////////////////////////////////////////////// defaultBackground.js
// custom background can be added to the topology panel
// for example, one can draw nodes on top of geographic map
// and depict network node's real locations
// if none is provided, the default grey circle background is used

NetVis.prototype.drawBackground = function() {
  canvas.append("circle")
    .attr("cx", 0.5*this._width)
    .attr("cy", 0.5*this._width)
    .attr("r", 0.3*this._width)
    .attr("class", "contour");
};
/////////////////////////////////////////////////////////////// view/message.js
// Defines render() function for messages
/////////////////////////////////////////////////////////////
NetVis.prototype.render = function() {
  var self = this;
  var width = $(self._topologyPanel).width();
  self._width = width;
  $("#netvis-topology-panel").empty();
  self.drawBackground();

  self.nodes.asArray.forEach(function(el) {
    if (!el._xAbs) {
      el._xAbs = el._x*width;
    }
    if (!el._yAbs) {
      el._yAbs = el._y*width;
    }
  });

  connections = canvas.selectAll('path.connection').data(self._selectedTimeInterval.connections)
    .enter().append('path')
    .attr("fill","transparent")
    .attr("stroke","black")
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','connection');


  messages = canvas.selectAll('line.message').data(self._selectedTimeInterval.messages)
    .enter().append('line')
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','message');


  messagesAnimation = canvas.selectAll('circle.messageAnimation').data(self._selectedTimeInterval.messages)
  .enter().append('circle')
  .on("click",function(d) { self._selected = d; self.render();})
  .attr('class','messageAnimation')
  .attr("r",0.5*self.config.nodeDefaultRadius);

  nodes = canvas.selectAll("circle.node").data(self._selectedTimeInterval.nodes)
    .enter().append("circle")
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','node')
    .attr("r",self.config.nodeDefaultRadius);

  labels = canvas.selectAll("text").data(self._selectedTimeInterval.nodes)
    .enter().append("text")
    .text(function(d) {return d.id; });

  syncPositions = function() {
    connections
      .attr("d", function(d) {
        from = "M" + d.connectingNode._xAbs + " " + d.connectingNode._yAbs + " ";
        curve = "C " + 0.5*width + " " + 0.5*width + " " +  0.5*width + " "+ 0.5*width;
        to = " " + d.dialedNode._xAbs + " " + d.dialedNode._yAbs;
        return from + curve + to;
      });


    messages
    .attr("x1", function(d) {return d.source._xAbs;})
    .attr("y1", function(d) {return d.source._yAbs;})
    .attr("x2", function(d) {return d.destination._xAbs;})
    .attr("y2", function(d) {return d.destination._yAbs;});


    messagesAnimation
      .attr("cx", self.drawMessageCX)
      .attr("cy", self.drawMessageCY);

    labels
      .attr("x", function(d) {return d._xAbs + self.config.nodeDefaultRadius*2.3;})
      .attr("y", function(d) {return d._yAbs;});

    return	nodes
    .attr("cx", function(d) {return d._xAbs;})
    .attr("cy", function(d) {return d._yAbs;});
  };


  window.clearInterval(self._animateTimer);
  self._animateTimer = window.setInterval(function() {
    self.messages.asArray.forEach(function(el){
      el._p = (el._p + 0.01) % 1.0;
    });
    syncPositions();
  }, 100);


  syncPositions()
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

  // highlight selected connection
  connections.filter(function(d) {return self._selected.id === d.id;})
    .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
    .attr('class','connection selected');

  // Render selected item graph position
  $("#tree").empty();
  var cur = self._selected;
  position = [];
  while (cur._root) {
    position.unshift({"label": cur._label, "obj": cur});
    cur = cur._root;
  }

  position.unshift({"label":"Network", "obj": self});
  d3.select("#tree")
    .selectAll("li")
    .data(position)
    .enter()
    .append("li")
    .append("a")
    .text(function(d) {return d.label;})
    .on("click", function(d) {self._selected = d.obj; self.render(); });

  $("#tree")
    .children("li")
    .last()
    .attr("class", "netvis-path-selected");

  // Render properties-table
  $("#properties-tbody").empty();
  attributes = [];
  if (self._selected._propertiesAlias) {
    objTraversed = self._selected._propertiesAlias;
  } else {
    objTraversed = self._selected;
  }

  for (var key in objTraversed) {
    if (!objTraversed.hasOwnProperty(key)) {
      // inherited attribute, ignoring
      continue;
    }
    if (typeof(objTraversed[key]) == "function") {
      // attribute is a function, ignoring
      continue;
    }
    if (key.charAt(0) === "_") {
      // private attribute, ignoring
      continue;
    }
    attributes.push({"attr": key, "value":objTraversed[key], "obj": typeof(objTraversed[key]) == "object"});
  }

  rows = d3.select("#properties-tbody").selectAll("tr").data(attributes).enter().append("tr");

  valued = rows.filter(function(d) {return !d.obj;});
  valued.append("td").text(function(d) {return d.attr; });
  valued
    .append("td")
    .append("div")
    .attr("class","properties-column")
    .text(function(d) {return d.value; });

  rows.filter(function(d) {return d.obj;}).append("td").append("a").text(function(d) {return d.attr; })
  .on("click", function(d) {self._selected = d.value; self.render();});


  if (self._playmode) {
    $("#play").find("span").attr("class","glyphicon glyphicon-pause");
  } else {
    $("#play").find("span").attr("class","glyphicon glyphicon-play");
  }

  if (self.config.loopPlay) {
    $("#repeat").attr("class","btn btn-danger");
  } else {
    $("#repeat").attr("class","btn btn-active");
  }


  // move time-controls panel
  $("#history")
    .val(self._selectedTimeInterval.i + 1)
    .change();

  $("#timestamp")
    .html(self._selectedTimeInterval.humanTimeLabel);

};
/////////////////////////////////////////////////////////////// view.js defines Netvis.view

NetVis.prototype._constructLogger = function() {
	$('.alert .close').on('click', function(e) {
	    $(this).parent().hide();
	});
	this.logger = {
		"_root": this,
		"_label":"logger",
		"error": function(errorMessage) {
			console.error(errorMessage);
			$('.error-alert').append("<p>"+ errorMessage +"</p>");
			$('.error-alert').show();
		},
		"info": function(logMessage) {
			console.log(logMessage);
		}
	};
};

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
			 	self._selectedTimeInterval = self.history.intervals[value -1];
			 	self._selected = self._selectedTimeInterval;
				self.render();
			 }
			});

			$(self._topologyPanel).empty();

			var width = $(self._topologyPanel).width();
			self._width = width;

			// define message drawing funcitions that use self._width
			self.drawMessageCX = function(d) {
				p0 = d.source._xAbs;
				p3 = d.destination._xAbs;
				c = self._width*0.5;
				t = d._p;
				return Math.pow(1-t,3)*p0 + 3*(1-t)*t*c + Math.pow(t,3)*p3;
			};

			self.drawMessageCY = function(d) {
				p0 = d.source._yAbs;
				p3 = d.destination._yAbs;
				c = self._width*0.5;
				t = d._p;
				return Math.pow(1-t,3)*p0 + 3*(1-t)*t*c + Math.pow(t,3)*p3;
			};

			// draw canvas
			canvas = d3.select(self._topologyPanel)
				.append("svg")
				.attr("id", "netvis-topology-panel")
				.attr("width",$(self._topologyPanel).width())
				.attr("height",$(self._topologyPanel).height());

			// Draw the big grey circle in the center
			self.render();
};
