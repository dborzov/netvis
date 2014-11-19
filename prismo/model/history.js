// Define history model and handlers


NetVisHistory = function() {
	BaseNetVisModel.apply(this); // History class inherits from baseModel
	
	this.loadEvent = function(obj, momentTime) {
		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		var i=1;
		obj.id = obj.time;
		while(this._asObject[obj.id]){
			i++;
			obj.id = obj.time + "#" + i;
		}
		obj.id = obj.time;
		this._asObject[obj.id] = obj;


		// insert event so that asArray is sorted
		// with binary search for appropriate position
		var cur = 0,
			lowI = 0,
			highI = this.asArray.length;
		while (lowI < highI) {
			cur = Math.floor((highI + lowI) /2);
			if (this.asArray[cur]._t.isBefore(obj._t)) {
				lowI = cur + 1;	
			} else {
				highI = cur;
			}
		}
		this.asArray.splice(Math.floor((highI + lowI) /2), 0,obj);
	};


	this.updateAll = function() {
		// create interval instances from events array
		if (!this.asArray) {
			// no events or not initialized
			return;
		}
		this.intervals = [];

		// all events happenning at the same time
		cur = 0;
		startEvents = [this.asArray[cur]];
		cur ++;
		while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(startEvents[0]._t)) {
			startEvents.push(this.asArray[cur]);			
			cur++;
		}

		while (cur < this.asArray.length) {
			finishEvents =[this.asArray[cur]];
			cur++;
			while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(finishEvents[0]._t)) {
				finishEvents.push(this.asArray[cur]);			
				cur++;
			}
			this.intervals.push(new NetVisInterval(startEvents, finishEvents));
			startEvents = finishEvents;
			console.log('now moving on with ', cur, ' and ', startEvents);
		}
	};


	// add default time margin moments
	this.loadEvent({"tag":"end"},moment("3000-01-01"));	
	this.loadEvent({"tag":"start"},moment("1970-01-01"));	
	this.updateAll();



};