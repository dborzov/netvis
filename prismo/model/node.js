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
	};
}