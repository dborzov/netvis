// Define history model and handlers


NetVis.prototype._constructHistory = function() {
	var self = this;
	self.history = new BaseNetVisModel(self, "timeline"); // History class inherits from baseModel

	self.history.loadEvent = function(obj, momentTime) {
		obj._root = self.history;

		obj._t = momentTime;
		obj.time = momentTime.toISOString();
		// eventID to be unique and contain timestamp
		// of form "<timestamp>#3" where 3 is count of events with
		// the same timestamp
		var i=1;
		obj.id = obj.time;
		while(this._asObject[obj.id]){
			i++;
			obj.id = obj.time + "#" + i + "(" + obj.event + ")";
		}
		obj.id = obj.time  + "(" + obj.event + ")";
		obj._label = obj.id;
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
		return obj;
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
				for(var i=0; i< self.nodes.asArray.length; i++) {
					if (self.nodes.asArray[i].permanentNode) {
						curInterval.nodes.push(self.nodes.asArray[i]);
					}
				}
			}
			curInterval.i = this.intervals.length; // store position index to assign timeline slider to the corresponding position
			curInterval._root = this;
			curInterval._label = "interval " + this.intervals.length;
			this.intervals.push(curInterval);
			startEvents = finishEvents;
		}


		// build doubly linked list for time intervals
		for (var j=0; j< this.intervals.length -1; j++) {

			this.intervals[j].next = this.intervals[j+1];
			this.intervals[j+1].prev = this.intervals[j];
		}

		// change human readable timestamp for the last time interval
		if (this.intervals.length) {
			this.intervals[this.intervals.length -1].humanTimeLabel = "At "  + this.intervals[this.intervals.length -1]._starts.format("dddd, MMMM Do YYYY, h:mm:ss a");
		}

	};





	self.history.next = function() {
		if (self._selectedTimeInterval) {
			if (self._selectedTimeInterval.next) {
				self._selectedTimeInterval = self._selectedTimeInterval.next;
			} else {
				// reached the end og the timeline, loop to beginning if repeat mode on
				if (self.config.loopPlay) {
					self._selectedTimeInterval = this.intervals[0];
				} else {
					self.play(); // toggle off the play mode
				}
			}
		}
	};

	self.history.prev = function() {
		if (!self._selectedTimeInterval) {
			return;
		}
		if (self._selectedTimeInterval.prev) {
			self._selectedTimeInterval = self._selectedTimeInterval.prev;
		}
	};

	// add default time margin moments
	self.history.loadEvent({"tag":"end"},moment("3000-01-01"));
	self.history.loadEvent({"tag":"start"},moment("1970-01-01"));
	self.history.updateAll();


};
