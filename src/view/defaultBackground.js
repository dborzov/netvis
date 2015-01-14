// defaultBackground.js
// custom background can be added to the topology panel
// for example, one can draw nodes on top of geographic map
// and depict network node's real locations
// if none is provided, the default grey circle background is used

NetVis.prototype.drawBackground = function() {
  canvas.append("circle")
    .attr("cx", 0.5*this._width)
    .attr("cy", 0.5*this._width)
    .attr("r", 0.3*this._width)
    .attr("class", "contour");
};
