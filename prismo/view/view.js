// view.js defines Netvis.view

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


NetVis.prototype.Render = function() {
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


	messages = canvas.selectAll('line.message').data(self.messages.asArray)
		.enter().append('line').attr('class','message');

	nodes = canvas.selectAll("circle.node").data(self.Nodes.asArray)
		.enter().append("circle").attr('class','node');

	var syncPositions = function() {
		messages
		    .attr("x1", function(d) {return d.source._xAbs;})
		    .attr("y1", function(d) {return d.source._yAbs;})
		    .attr("x2", function(d) {return d.destination._xAbs;})
		    .attr("y2", function(d) {return d.destination._yAbs;});

		return	nodes
		    .attr("cx", function(d) {return d._xAbs;})
		    .attr("cy", function(d) {return d._yAbs;});
	};

	
	syncPositions()
	    .on("click",function(d) { self._selected = d; self.Render();})
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
		.attr("r",2*self.config.nodeDefaultRadius);


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
        .on("click", function(d) {self._selected = d.value; self.Render();});
};