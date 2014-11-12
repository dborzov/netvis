// parse deserializes network trace files in NetVis format

NetVis.prototype.parse = function(srcJSON) {
	// jsonAdapter loads JSON in NetVis format   
	if (!srcJSON) {
		return 'srcJSON needs to be JSON object';
	}
	if (srcJSON.nodes) {
		for (var nodeKey in srcJSON.nodes) {
			this.Nodes.load(srcJSON.nodes[nodeKey]);
		}
		this.Nodes.updateAll();
	}

	if (srcJSON.messages) {
		for (var msgKey in srcJSON.messages) {
			this._parseMessage(srcJSON.messages[msgKey]);
		}
	}

};
