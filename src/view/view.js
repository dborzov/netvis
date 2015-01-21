// view.js defines Netvis.view

NetVis.prototype._constructLogger = function() {
	$('.alert .close').on('click', function(e) {
	    $(this).parent().hide();
	});
	this.logger = {
		"_root": this,
		"_label":"logger",
		"error": function(errorMessage) {
			console.error(errorMessage);
			$('.error-alert').append("<p>"+ errorMessage +"</p>");
			$('.error-alert').show();
		},
		"info": function(logMessage) {
			console.log(logMessage);
		}
	};
};

NetVis.prototype.initView = function() {
			var self = this;


			// Render time-controls panel
			$("#history")
				.attr("min",1)
				.attr("max",this.history.intervals.length)
				.val(1);

			$('#history').rangeslider('destroy');
			$('#history').rangeslider({
			 polyfill: false,
			 onSlideEnd: function(position, value) {
			 	self._selectedTimeInterval = self.history.intervals[value -1];
			 	self._selected = self._selectedTimeInterval;
				self.render();
			 }
			});

			$(self._topologyPanel).empty();

			var width = $(self._topologyPanel).width();
			self._width = width;

			// define message drawing funcitions that use self._width
			self.drawMessageCX = function(d) {
				p0 = d.source._xAbs;
				p3 = d.destination._xAbs;
				c = self._width*0.5;
				t = d._p;
				return Math.pow(1-t,3)*p0 + 3*(1-t)*t*c + Math.pow(t,3)*p3;
			};

			self.drawMessageCY = function(d) {
				p0 = d.source._yAbs;
				p3 = d.destination._yAbs;
				c = self._width*0.5;
				t = d._p;
				return Math.pow(1-t,3)*p0 + 3*(1-t)*t*c + Math.pow(t,3)*p3;
			};

			self.drawConnection = function(d) {
				from = "M" + d.connectingNode._xAbs + " " + d.connectingNode._yAbs + " ";
				curve = "C " + 0.5*self._width + " " + 0.5*self._width + " " +  0.5*self._width + " "+ 0.5*self._width;
				to = " " + d.dialedNode._xAbs + " " + d.dialedNode._yAbs;
				return from + curve + to;
			};

			self.drawMessage = function(d) {
				from = "M" + d.source._xAbs + " " + d.source._yAbs + " ";
				curve = "C " + 0.5*self._width + " " + 0.5*self._width + " " +  0.5*self._width + " "+ 0.5*self._width;
				to = " " + d.destination._xAbs + " " + d.destination._yAbs;
				return from + curve + to;
			};

			// draw canvas
			canvas = d3.select(self._topologyPanel)
				.append("svg")
				.attr("id", "netvis-topology-panel")
				.attr("width",$(self._topologyPanel).width())
				.attr("height",$(self._topologyPanel).height());

			// Draw the big grey circle in the center
			self.render();
};
