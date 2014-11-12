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

	self.jsonAdapter = function(srcJSON) {
		// jsonAdapter loads JSON in NetVis format   
		if (!srcJSON) {
			return 'srcJSON needs to be JSON object';
		}
		if (srcJSON.nodes) {
			for (var nodeKey in srcJSON.nodes) {
				self.Nodes.load(srcJSON.nodes[nodeKey]);
			}
			self.Nodes.updateAll();
		}

		if (srcJSON.messages) {
			for (var msgKey in srcJSON.messages) {
				self.View.Logger.info("load msg ");
				self.View.Logger.info(srcJSON.messages[msgKey]);
				self.messages.load(srcJSON.messages[msgKey]);
			}
		}

	};

	self.resetPositions = function() {
		self.Nodes.resetPositions();
		self._selected = self;
		self.Render();
	};
}




