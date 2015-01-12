// parse NodeEntered event

NetVis.prototype._parseNodeEntered = function(src) {
  var r = this.nodes.load({
    "id": src.name,
    "permanentNode": false
  });

  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
