// NetVis defines global object NetVis that wraps up everything else

// constructor for NetVis class
function NetVis(Options) {
	var self = this;
	self._topologyPanel = Options.topologyPanel || "#chart";
	self._historyPanel = Options.historyPanel || "#history";
	self._timePanel = Options.timePanel || "#timestamp";
	self.playmode = false;

	self.config = {
		nodeDefaultDistance: 30,
		nodeDefaultRadius: 10
	};

	self.Nodes = new NetVisNodes();
	self.messages = new NetVisMessages();
	self._constructNetVisHistory();
	self.View = new NetVisView();
	self._selected = self; // _selected object's public attributes are shown at properties-table


	self.resetPositions = function() {
		self.Nodes.resetPositions();
		self._selected = self;
		self.render();
	};


	self.updateAll = function() {
		this.Nodes.updateAll();
		this.messages.updateAll();
		this.history.updateAll();

		if (this.history.intervals) {
			this.selectedTimeInterval = this.history.intervals[0];
		}
	};

	self.play = function() {
		self.playmode = !self.playmode;
		if (self.playmode) {
			self.playTicker = window.setInterval(function() {
				console.log('tick tack');
				self.history.next();
				self.render();
			}, 800);
		} else {
			window.clearInterval(self.playTicker); // clear play ticking timer
		}
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
