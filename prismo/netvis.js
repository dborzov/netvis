// NetVis defines global object NetVis that wraps up everything else 

// constructor for NetVis class
function NetVis(DOMelement) {
	var self = this;
	self._topologyPanel = DOMelement || "#chart";
	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Nodes = new NetVisNodes();
	self.messages = new NetVisMessages();
	self.View = new NetVisView();
	self._selected = self; // _selected object's public attributes are shown at properties-table

	self.resetPositions = function() {
		self.Nodes.resetPositions();
		self._selected = self;
		self.Render();
	};
}




