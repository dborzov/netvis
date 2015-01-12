// parse NodeExited event

NetVis.prototype._parseNodeExited = function(src) {
  var r = this.nodes.load({
    "id": src.name
  });
  console.log("parseNodeExited reports node: ", r, " from event record: ", src);
  src.node = r;
  var e = this.history.loadEvent(src, moment(src.time));
  return r;
};
