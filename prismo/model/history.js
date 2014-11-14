// Define history model and handlers


NetVisHistory = function() {
	BaseNetVisModel.apply(this); // History class inherits from baseModel
	
	this.loadEvent = function(obj, momentTime) {
		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		var i=1,
			obj.id = obj.time;
		while(this._asObject[obj.id]){
			i++;
			obj.id = obj.time + "#" + i;
		}
		obj.id = obj.time;
		this.load(obj);
	};
	// add default time margin moments
	this.loadEvent({"tag":"start"},moment("1970-01-01"));	
	this.loadEvent({"tag":"end"},moment("3000-01-01"));	
};