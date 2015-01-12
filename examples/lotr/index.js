var demo; // define netVis object here so that it is global
// and console accessable

$(function() {

  Settings = {};
  demo = new NetVis(Settings);
  var SrcURL="lotr.netvis";

  $('#history').rangeslider();


  $("#reset-positions").click(demo.resetPositions);
  $("#play").click(demo.play);
  $("#repeat").click(demo.loopPlay);


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
