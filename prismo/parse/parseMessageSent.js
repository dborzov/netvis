// parseMessage.js

NetVis.prototype._parseMessageSent = function(src) {
	// sanity check validation
	// check if loggerID node was initialized
	if (!src.loggerID || !src.destinationNode){
		return 'parseMessageSent() no logger ID or destinationNode ID provided, too broken';
	}

	var r = this.messages.load(src.message, src.message.request_id);
	if (typeof(r) === "string") {
		console.log('no luck with ', r);
		return r;
	}

	this.Nodes.load({"id":src.loggerID});
	r.source = this.Nodes._asObject[src.loggerID];


	this.Nodes.load({"id":src.destinationNode});
	r.destination = this.Nodes._asObject[src.destinationNode];

	src.message = r;
	var e = this.history.loadEvent(src, moment(src.time));

	return r;
};

