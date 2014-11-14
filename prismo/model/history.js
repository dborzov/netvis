// Define history model and handlers


NetVisHistory = function() {
	BaseNetVisModel.apply(this); // History class inherits from baseModel
	
	this.loadEvent = function(obj, momentTime) {
		log.console('loading event ', obj);
		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		var isoTime = momentTime.toISOString();
		var i=0;
		var eventID = isoTime; 
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		log.console(eventID);
		while (this.asObject[eventID]){
			i++;
			eventID = isoTime + "#" + i;
		}
		obj.id = eventID;
		this.load(obj);
	};
	// add default time margin moments
	this.loadEvent({"tag":"start"},moment("1970-01-01"));	
	this.loadEvent({"tag":"end"},moment("3000-01-01"));	
};