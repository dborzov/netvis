// parse nodeConnected event

NetVis.prototype._parseNodeConnected = function(src) {
    var r = this.connections.load({
      "connectingNode": src.connectingNode,
      "dialedNode":src.dialedNode
    }, src.connectingNode + ":" + src.dialedNode);
    r.connectingNode = this.nodes.load({"id":src.connectingNode});
    r.dialedNode = this.nodes.load({"id":src.dialedNode});

    var e = this.history.loadEvent(src, moment(src.time));
    e.connection = r;
    return e;
};
