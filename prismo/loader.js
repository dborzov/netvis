$(function() {
  var Prismo = new NetVis(),
    SrcURL="example/example.json";
  d3.json(SrcURL, function(error, json) {
  	if (error) {
  		Prismo.View.Logger.error("Failure loading "+SrcURL+": "+ error.statusText);
  		return;
  	}
  	Prismo.View.Logger.info("Succesfully resolved " + SrcURL);
    Prismo.jsonAdapter(json);
    Prismo.View.Logger.info(Prismo);
    Prismo.Render();
  });
});