// BaseNetVisModel contains common elements shared among all the NetVis models
// NetVis.nodes, NetVis.messages, NetVis.history inherit from BaseNetVisModel

BaseNetVisModel = function() {
	var self = this;
	self._asObject = {}; // used to store info on nodes
	self.asArray = []; // array of node's data mirrors _asObject data, connected to d3 canvas
	self.load = function(srcObject, assignID) {
		// loadNode updates nodesModel with node data read off srcObject
		// e.g. loadNode({'id':'ff34', 'name':'Node34'})
		// returns created object if success, error string if failed
		if (!srcObject.id && assignID) {
			srcObject.id = assignID;
		}

		if (!srcObject.id) {
			return 'BaseNetVisModel.load() no ID provided';
		} 
		if (self._asObject[srcObject.id]) {
			// instance already exists
			return self._asObject[srcObject.id];
		}

		self._asObject[srcObject.id] = srcObject;
		self.asArray.push(srcObject);
		return srcObject;
	};
};