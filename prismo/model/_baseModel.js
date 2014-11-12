// BaseNetVisModel contains common elements shared among all the NetVis models
// NetVis.nodes, NetVis.messages, NetVis.history inherit from BaseNetVisModel

BaseNetVisModel = function() {
	var self = this;
	self._asObject = {}; // used to store info on nodes
	self.asArray = []; // array of node's data mirrors _asObject data, connected to d3 canvas
	self.load = function(srcObject) {
		// loadNode updates nodesModel with node data read off srcObject
		// e.g. loadNode({'id':'ff34', 'name':'Node34'})
		// returns created object if success, error string if failed
		if (!srcObject.id) {
			return 'Descriptor has no ID';
		}
		if (self._asObject[srcObject.id]) {
			return 'Data for object with id:'+srcObject.id+' already loaded, updating not implemented';
		}

		self._asObject[srcObject.id] = srcObject;
		self.asArray.push(srcObject);
		return srcObject;
	};
};