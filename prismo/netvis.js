// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self._topologyPanel = DOMelement || "#chart";
	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Nodes = new NetVisModelNodes();
	self.View = new NetVisView();
	self._selected = self; // _selected object's public attributes are shown at properties-table

	this.jsonAdapter = function(srcJSON) {
		// jsonAdapter loads JSON in NetVis format   
		if (!srcJSON) {
			return 'srcJSON needs to be JSON object';
		}
		if (srcJSON.nodes) {
			for (var nodeKey in srcJSON.nodes) {
				self.Nodes.loadNode(srcJSON.nodes[nodeKey]);
			}
		}

	};
	this.Render = function() {
		canvas = d3.select(self._topologyPanel) .append("svg")
			.attr("width",$(self._topologyPanel).width())
			.attr("height",$(self._topologyPanel).height());

		canvas.append("circle")
			.attr("cx", 0.5*$(self._topologyPanel).width())
			.attr("cy", 0.5*$(self._topologyPanel).width())
			.attr("r", 0.3*$(self._topologyPanel).width())
			.attr("class", "contour");

		nodes = canvas.selectAll("circle.node").data(self.Nodes._nodesArray).enter().append("circle");
		nodes
			.attr('class','node')
		    .attr("cx", function(d) { return d.x*$(self._topologyPanel).width();})
		    .attr("cy", function(d) { return d.y*$(self._topologyPanel).width();})
		    .attr("r",self.config.nodeDefaultRadius);

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

	       $("#properties-tbody").append("<tr><td>"+key + "</td><td>" + self._selected[key] + "</td></tr>");
		   
		}
	};
}




