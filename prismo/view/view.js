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
