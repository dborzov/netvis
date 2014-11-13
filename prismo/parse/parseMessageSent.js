// parseMessage.js

NetVis.prototype._parseMessageSent = function(src) {
	// returns created object if success, string if error parsing
	var r = this.messages.load(src, src.message.request_id);
	if (typeof(r) === "string") {
		console.log('no luck with ', r);
		return r;
	}

	// check if loggerID node was initialized
	if (!r.loggerID || !r.destinationNode){
		return 'parseMessageSent() no logger ID or destinationNode ID provided, too broken';
	}
	this.Nodes.load({"id":r.loggerID});
	r.source = this.Nodes._asObject[r.loggerID];
	delete r.loggerID;


	this.Nodes.load({"id":r.destinationNode});
	r.destination = this.Nodes._asObject[r.destinationNode];
	delete r.destinationNode;

	return r;
};

