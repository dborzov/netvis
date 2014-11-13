$(function() {
  var demo = new NetVis(),
    SrcURL="example/earth.json";


  $("#reset-positions").click(demo.resetPositions);
  d3.json(SrcURL, function(error, json) {
  	if (error) {
  		demo.View.Logger.error("Failure loading "+SrcURL+": "+ error.statusText);
  		return;
  	}
  	demo.View.Logger.info("Succesfully resolved " + SrcURL);
    demo.parse(json);
    demo.View.Logger.info(demo);
    demo.Render();
  });
});