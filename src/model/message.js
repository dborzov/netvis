// NetVis.Messages handles network's messages that nodes communicate with

NetVis.prototype._constructMessages = function() {
	var self = this;
	self.messages = new BaseNetVisModel(self, "messages"); // Messages class inherits from baseModel

	self.messages.updateAll = function() {
		for (var i=0; i< this.asArray.length; i++) {
			this.asArray[i]._p = Math.random(); // _p goes from 0 to 100 to animate message direction
		}
	};
};
