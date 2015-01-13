// NetVis defines global object NetVis that wraps up everything else

// constructor for NetVis class
function NetVis(Options) {
	var self = this;
	self._topologyPanel = Options.topologyPanel || "#chart";
	self._historyPanel = Options.historyPanel || "#history";
	self._timePanel = Options.timePanel || "#timestamp";
	self._playmode = false;

	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10,
		loopPlay: false
	};

	self._constructNodes(); // constructor for self.nodes
	self._constructMessages(); // constructor for self.messages
	self._constructHistory(); // constructor for self.history
	self.View = new NetVisView();
	self._selected = self; // _selected object's public attributes are shown at properties-table


	self.resetPositions = function() {
		self.nodes.resetPositions();
		self._selected = self;
		self.render();
	};


	self.updateAll = function() {
		this.nodes.updateAll();
		this.messages.updateAll();
		this.history.updateAll();

		if (this.history.intervals) {
			this._selectedTimeInterval = this.history.intervals[0];
		}
	};

	self.play = function() {
		self._playmode = !self._playmode;
		if (self._playmode) {
			self._playTicker = window.setInterval(function() {
				self.history.next();
				self.render();
			}, 800);
		} else {
			window.clearInterval(self._playTicker); // clear play ticking timer
		}
		self.render();
	};

	self.loopPlay = function() {
		self.config.loopPlay = !self.config.loopPlay;
		self.render();
	};

}


// NetVis can be imported as node.js module
// (currently used for testing)
if (typeof module != 'undefined') {
	module.exports = {
		NetVis: NetVis
	};
}
