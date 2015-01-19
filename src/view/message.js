// view/message.js
// Defines render() function for messages


NetVis.prototype.drawMessageCX = function(d) {
  alphaX = d.source._xAbs;
  betaX = d.destination._xAbs;
  aX = 300;
  t = d._p;
  GY = alphaX + 2*t*(aX - alphaX) + (alphaX + betaX - 2 *aX)*t*t;
  console.log("MessageCX reporting in: ", GY);
  return GY;
};

NetVis.prototype.drawMessageCY = function(d) {
  alphaX = d.source._yAbs;
  betaX = d.destination._yAbs;
  aX = 300;
  t = d._p;
  Gy =alphaX + 2*t*(aX - alphaX) + (alphaX + betaX - 2*aX)*t*t;
  console.log("MessageCY reporting in: ", Gy);
  return alphaX + 2*t*(aX - alphaX) + (alphaX + betaX - 2*aX)*t*t;
};
