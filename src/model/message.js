// NetVis.Messages handles network's messages that nodes communicate with


NetVisMessages = function() {
	var self = this;
	BaseNetVisModel.apply(self); // Messages class inherits from baseModel

	self.updateAll = function() {
		for (var i=0; i< self.asArray.length; i++) {
			self.asArray[i]._p = Math.random(); // _p goes from 0 to 100 to animate message direction
		}
	};
};