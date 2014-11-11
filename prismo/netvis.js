// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self.DOMelement = DOMelement || "#chart";
	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Nodes = new NetVisModelNodes();
	this.View = new NetVisView();

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
		nodes = d3.select(self.DOMelement).append("svg").append("circle");
		nodes
		    .attr("cx", self.config.nodeDefaultDistance)
		    .attr("cy", self.config.nodeDefaultDistance)
		    .attr("r",self.config.nodeDefaultRadius);
	};
}




