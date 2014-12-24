// Define history model and handlers


NetVis.prototype._constructNetVisHistory = function() {
	var self = this;
	self.history = new BaseNetVisModel(this); // History class inherits from baseModel

	self.history.loadEvent = function(obj, momentTime) {
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


	self.history.updateAll = function() {
		// create interval instances from events array
		if (!this.asArray) {
			// no events or not initialized
			return;
		}
		this.intervals = [];
		var curInterval = 0;

		// sorting all the events by happenning at the same timestamps
		// and making time interval instances
		cur = 0;
		startEvents = [this.asArray[cur]];
		cur ++;
		while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(startEvents[0]._t)) {
			startEvents.push(this.asArray[cur]);
			cur++;
		}

		// traversing all simultanious events into events for interval boundaries
		while (cur < this.asArray.length) {
			finishEvents =[this.asArray[cur]];
			cur++;
			while (cur < this.asArray.length -1 && !this.asArray[cur]._t.isAfter(finishEvents[0]._t)) {
				finishEvents.push(this.asArray[cur]);
				cur++;
			}

			curInterval = new NetVisInterval(startEvents, finishEvents, curInterval);
			if (this.intervals.length === 0) {
				console.log("Whoop-doop: ", self.Nodes.asArray[i]);
				for(var i=0; i< self.Nodes.asArray.length; i++) {
					if (self.Nodes.asArray[i].permanentNode) {
						curInterval.nodes.push(self.Nodes.asArray[i]);
					}
				}
			}
			this.intervals.push(curInterval);
			startEvents = finishEvents;
		}


		if (this.intervals) {
			this.selectedTimeInterval = this.intervals[0];
		}
	};


	// add default time margin moments
	self.history.loadEvent({"tag":"end"},moment("3000-01-01"));
	self.history.loadEvent({"tag":"start"},moment("1970-01-01"));
	self.history.updateAll();


};
