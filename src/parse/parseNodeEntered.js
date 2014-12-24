// parse NodeEntered event

NetVis.prototype._parseNodeEntered = function(src) {
  var r = this.Nodes.load({
    "id": src.name,
    "permanentNode": false
  });
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
