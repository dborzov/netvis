// parse NodeEntered event

NetVis.prototype._parseNodeEntered = function(src) {
  var r = this.Nodes.load({"id": src.name});
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
