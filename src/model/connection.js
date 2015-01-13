// NetVis.connections handles network's connections between nodes

NetVis.prototype._constructConnections = function() {
    this.connections = new BaseNetVisModel(this, "connections");
};
