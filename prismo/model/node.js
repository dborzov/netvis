// Define network node model and handlers

NetVisNodes = function() {
	var self = this;
	BaseNetVisModel.apply(self); // Nodes class inherits from baseModel

	self.updateAll = function() {
		// generate default node's positioning coordinates on canvas
		if (self.asArray.length === 0) {
			// when no nodes loaded, computing arc variable would involve dividing by zero
			return;
		}
		var	arc = 2 * Math.PI / self.asArray.length;
		for (var i=0; i< self.asArray.length; i++) {
			self.asArray[i]._x = 0.5 + 0.3 * Math.sin(i*arc);
			self.asArray[i]._y = 0.5 - 0.3 * Math.cos(i*arc);
		}
	};

	self.resetPositions = function() {
		for (var i=0; i< self.asArray.length; i++) {
			delete self.asArray[i]._xAbs;
			delete self.asArray[i]._yAbs;
		}
	};
};