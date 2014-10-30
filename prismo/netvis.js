// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self.DOMelement = DOMelement || "#chart";
	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Model = {
		Nodes: [{
			'id':'abba'
		}
		]
	};

	this.Render = function() {
		nodes = d3.select(self.DOMelement).append("svg").append("circle");
		nodes
		    .attr("cx", self.config.nodeDefaultDistance)
		    .attr("cy", self.config.nodeDefaultDistance)
		    .attr("r",self.config.nodeDefaultRadius);
	};
}


var Prismo = new NetVis();

$(function() {
  console.log('jquery is working!');
  Prismo.Render();
});