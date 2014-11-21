// Define time interval model



NetVisInterval = function(startEvents, endEvents, prevInterval) {
	this.startEvents = startEvents;
	this.endEvents = endEvents;
	this._starts = startEvents[0]._t; // as momentjs object
	this._ends = endEvents[0]._t; // as momentjs object
	this.starts = this._starts.toISOString(); // as ISO timestamp
	this.ends = this._ends.toISOString();

	if (prevInterval) {
		this.messages = prevInterval.messages.slice(0); 	
	} else {
		this.messages = [];
	}

	for(var i=0; i< this.startEvents.length; i++) {
		var event = this.startEvents[i]; 
		switch (event.event) {
			case "messageSent":
				this.messages.push(event.message);
		}
	}
};