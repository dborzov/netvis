// Define time interval model



NetVisInterval = function(startEvents, endEvents, prevInterval) {
	this.startEvents = startEvents;
	this.endEvents = endEvents;
	this._starts = startEvents[0]._t; // as momentjs object
	this._ends = endEvents[0]._t; // as momentjs object
	this.starts = this._starts.toISOString(); // as ISO timestamp
	this.ends = this._ends.toISOString();

	if (prevInterval) {
		this.messages = prevInterval.messages.slice(0); // copying array instance
		this.nodes = 	prevInterval.nodes.slice(0);
	} else {
		this.messages = [];
		this.nodes = [];
	}

	for(var i=0; i< this.startEvents.length; i++) {
		var event = this.startEvents[i];
		switch (event.event) {
			case "nodeEntered":
				this.nodes.push(event.node);
				break;
			case "messageSent":
				this.messages.push(event.message);
				break;
			case "messageReceived":
				for(var j = this.messages.length - 1; j >= 0; j--) {
				    if(this.messages[j].id === event.message.id) {
				       this.messages.splice(j, 1);
				    }
				}
		}
	}
};
