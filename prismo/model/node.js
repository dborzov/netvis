// Define network node model and handlers

function NetVisModelNodes() {
	var self = this;
	self._nodesObject = {}; // used to store info on nodes
	self._nodesArray = []; // array of node's data mirrors _nodesObject data, connected to d3 canvas
	self.loadNode = function(srcObject) {
		// loadNode updates nodesModel with node data read off srcObject
		// e.g. loadNode({'id':'ff34', 'name':'Node34'})
		if (!srcObject.id) {
			return 'Node descriptor has no ID';
		}
		if (self._nodesObject[srcObject.id]) {
			return 'Data for node '+srcObject.id+' already loaded, updating not implemented';
		}

		self._nodesObject[srcObject.id] = srcObject;
		self._nodesArray.push(srcObject); 
		self.updateAll();
	};

	self.updateAll = function() {
		// generate default node's positioning coordinates on canvas
		if (self._nodesArray.length === 0) {
			// when no nodes loaded, 
			return;
		}
			arc = 2 * Math.PI / self._nodesArray.length;
		for (var i=0; i< self._nodesArray.length; i++) {
			self._nodesArray[i]._x = 0.5 + 0.3 * Math.sin(i*arc);
			self._nodesArray[i]._y = 0.5 - 0.3 * Math.cos(i*arc);
		}
	};

	self.resetPositions = function() {
		for (var i=0; i< self._nodesArray.length; i++) {
			delete self._nodesArray[i]._xAbs;
			delete self._nodesArray[i]._yAbs;
		}
	};
}