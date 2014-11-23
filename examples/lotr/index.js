$(function() {

  var Settings = {}, 
    demo = new NetVis(Settings),
    SrcURL="lotr.netvis";

  $('#history').rangeslider();


  $("#reset-positions").click(demo.resetPositions);
  d3.json(SrcURL, function(error, json) {
  	if (error) {
  		demo.View.Logger.error("Failure loading "+SrcURL+": "+ error.statusText);
  		return;
  	}
  	demo.View.Logger.info("Succesfully resolved " + SrcURL);
    demo.parse(json);
    demo.View.Logger.info(demo);
    demo.initView();
  });
});