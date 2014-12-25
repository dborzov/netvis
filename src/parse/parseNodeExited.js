// parse NodeExited event

NetVis.prototype._parseNodeExited = function(src) {
  var r = this.Nodes.load({
    "id": src.name,
    "permanentNode": false
  });

  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
