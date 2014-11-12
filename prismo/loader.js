$(function() {
  var Prismo = new NetVis(),
    SrcURL="example/mercury.json";


  $("#reset-positions").click(Prismo.resetPositions);
  d3.json(SrcURL, function(error, json) {
  	if (error) {
  		Prismo.View.Logger.error("Failure loading "+SrcURL+": "+ error.statusText);
  		return;
  	}
  	Prismo.View.Logger.info("Succesfully resolved " + SrcURL);
    Prismo.parse(json);
    Prismo.View.Logger.info(Prismo);
    Prismo.Render();
  });
});