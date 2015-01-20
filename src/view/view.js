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
				alphaX = d.source._xAbs;
				betaX = d.destination._xAbs;
				aX = self._width*0.5;
				t = d._p;
				GY = alphaX + 2*t*(aX - alphaX) + (alphaX + betaX - 2 *aX)*t*t;
				return GY;
			};

			self.drawMessageCY = function(d) {
				alphaX = d.source._yAbs;
				betaX = d.destination._yAbs;
				aX = self._width*0.5;
				t = d._p;
				return alphaX + 2*t*(aX - alphaX) + (alphaX + betaX - 2*aX)*t*t;
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
