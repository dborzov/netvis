// parseMessage.js

NetVis.prototype._parseMessage = function(src) {
	// returns created object if success, string if error parsing
	var r = this.messages.load(src);
	if (typeof(r) === "string") {
		return r;
	}

	if (this.Nodes._asObject[r.sourceNode]) {
		r.source = this.Nodes._asObject[r.sourceNode];
	}

	if (this.Nodes._asObject[r.destinationNode]) {
		r.destination = this.Nodes._asObject[r.destinationNode];
	}
	return r;
};

