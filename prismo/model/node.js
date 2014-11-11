// Define network node model and handlers

NetVisNodes = function() {
	var self = this;
	self._asObject = {}; // used to store info on nodes
	self.asArray = []; // array of node's data mirrors _asObject data, connected to d3 canvas
	self.load = function(srcObject) {
		// loadNode updates nodesModel with node data read off srcObject
		// e.g. loadNode({'id':'ff34', 'name':'Node34'})
		if (!srcObject.id) {
			return 'Descriptor has no ID';
		}
		if (self._asObject[srcObject.id]) {
			return 'Data for node '+srcObject.id+' already loaded, updating not implemented';
		}

		self._asObject[srcObject.id] = srcObject;
		self.asArray.push(srcObject); 
		self.updateAll();
	};

	self.updateAll = function() {
		// generate default node's positioning coordinates on canvas
		if (self.asArray.length === 0) {
			// when no nodes loaded, 
			return;
		}
			arc = 2 * Math.PI / self.asArray.length;
		for (var i=0; i< self.asArray.length; i++) {
			self.asArray[i]._x = 0.5 + 0.3 * Math.sin(i*arc);
			self.asArray[i]._y = 0.5 - 0.3 * Math.cos(i*arc);
		}
	};

	self.resetPositions = function() {
		for (var i=0; i< self.asArray.length; i++) {
			delete self.asArray[i]._xAbs;
			delete self.asArray[i]._yAbs;
		}
	};
};