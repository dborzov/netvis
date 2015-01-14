// view.js defines Netvis.view

function NetVisView() {
	$('.alert .close').on('click', function(e) {
	    $(this).parent().hide();
	});
	this.Logger = {
		"error": function(errorMessage) {
			console.error(errorMessage);
			$('.error-alert').append("<p>"+ errorMessage +"</p>");
			$('.error-alert').show();
		},
		"info": function(logMessage) {
			console.log(logMessage);
		}
	};
}

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
		canvas = d3.select(self._topologyPanel)
			.append("svg")
			.attr("id", "netvis-topology-panel")
			.attr("width",$(self._topologyPanel).width())
			.attr("height",$(self._topologyPanel).height());

		// Draw the big grey circle in the center
     self.render();
};
