// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self.DOMelement = DOMelement || "#chart";
	self.Model = {
		Nodes: [{
			'id':'abba'
		}
		]
	};

	this.Render = function() {
		nodes = d3.select(self.DOMelement).append("svg").append("circle");
		nodes.attr("cx", 30).attr("cy", 30).attr("r",10);
	};
}


var Prismo = new NetVis();

$(function() {
  console.log('jquery is working!');
  Prismo.Render();
});