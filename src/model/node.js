// Define network node model and handlers

NetVis.prototype._constructNodes = function() {
	var self = this;

	self.nodes = new BaseNetVisModel(self, "nodes"); // nodes class inherits from baseModel


	superLoad = self.nodes.load;
	self.nodes.load = function(srcObject, assignID) {
		// if a new node instance and "permanentNode" is not false, will make the
		if (srcObject.id && !self.nodes._asObject[srcObject.id]) {
			if (typeof srcObject.permanentNode === 'undefined') {
				srcObject.permanentNode = true;
			}
			return superLoad(srcObject, assignID);
		}
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
