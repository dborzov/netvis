// Define history model and handlers


NetVisHistory = function() {
	BaseNetVisModel.apply(this); // History class inherits from baseModel
	
	this.loadEvent = function(obj, momentTime) {
		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		this.load(obj,momentTime.toISOString());
	};
	// add default time margin moments
	this.loadEvent({"tag":"start"},moment("1970-01-01"));	
	this.loadEvent({"tag":"end"},moment("3000-01-01"));	
};