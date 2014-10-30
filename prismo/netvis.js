// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self.DOMelement = DOMelement || "#chart";
	console.log("NetVis intialized!", self.DOMelement);
	self.Model = {
		Nodes: [{
			'id':'abba'
		}
		]
	};

	this.Render = function() {
		d3.select(self.DOMelement).append("svg");
	};
}


var Prismo = new NetVis();