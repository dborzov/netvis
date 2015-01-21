
NetVis.prototype.render = function() {
  var self = this;
  var width = $(self._topologyPanel).width();
  self._width = width;
  $("#netvis-topology-panel").empty();
  self.drawBackground();

  self.nodes.asArray.forEach(function(el) {
    if (!el._xAbs) {
      el._xAbs = el._x*width;
    }
    if (!el._yAbs) {
      el._yAbs = el._y*width;
    }
  });

  connections = canvas.selectAll('path.connection').data(self._selectedTimeInterval.connections)
    .enter().append('path')
    .attr("fill","transparent")
    .attr("stroke","black")
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','connection');


  messages = canvas.selectAll('path.message').data(self._selectedTimeInterval.messages)
    .enter().append('path')
    .attr("fill","transparent")
    .attr("stroke","black")
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','message');


  messagesAnimation = canvas.selectAll('circle.messageAnimation').data(self._selectedTimeInterval.messages)
  .enter().append('circle')
  .on("click",function(d) { self._selected = d; self.render();})
  .attr('class','messageAnimation')
  .attr("r",0.5*self.config.nodeDefaultRadius);

  nodes = canvas.selectAll("circle.node").data(self._selectedTimeInterval.nodes)
    .enter().append("circle")
    .on("click",function(d) { self._selected = d; self.render();})
    .attr('class','node')
    .attr("r",self.config.nodeDefaultRadius);

  labels = canvas.selectAll("text").data(self._selectedTimeInterval.nodes)
    .enter().append("text")
    .text(function(d) {return d.id; });

  syncPositions = function() {
    connections
      .attr("d", self.drawConnection);


    messages
      .attr("d", self.drawMessage);
    

    messagesAnimation
      .attr("cx", self.drawMessageCX)
      .attr("cy", self.drawMessageCY);

    labels
      .attr("x", function(d) {return d._xAbs + self.config.nodeDefaultRadius*2.3;})
      .attr("y", function(d) {return d._yAbs;});

    return	nodes
    .attr("cx", function(d) {return d._xAbs;})
    .attr("cy", function(d) {return d._yAbs;});
  };


  window.clearInterval(self._animateTimer);
  self._animateTimer = window.setInterval(function() {
    self.messages.asArray.forEach(function(el){
      el._p = (el._p + 0.01) % 1.0;
    });
    syncPositions();
  }, 100);


  syncPositions()
  .call(d3.behavior.drag()
  .on("dragstart", function(d) {
    this.__origin__ = [d._xAbs, d._yAbs];
  })
  .on("drag", function(d) {
    d._xAbs = Math.min(width, Math.max(0, this.__origin__[0] += d3.event.dx));
    d._yAbs = Math.min(width, Math.max(0, this.__origin__[1] += d3.event.dy));
    syncPositions();
  })
  .on("dragend", function() {
    delete this.__origin__;
  }));



  // highlight selected node
  nodes.filter(function(d) {return self._selected.id === d.id;})
  .attr('class','node selected')
  .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
  .attr("r",2*self.config.nodeDefaultRadius);

  // highlight selected message
  messages.filter(function(d) {return self._selected.id === d.id;})
  .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
  .attr('class','message selected');

  // highlight selected connection
  connections.filter(function(d) {return self._selected.id === d.id;})
    .on("click",function(d) { self._selected = self; self.render();}) // double click unselects it
    .attr('class','connection selected');

  // Render selected item graph position
  $("#tree").empty();
  var cur = self._selected;
  position = [];
  while (cur._root) {
    position.unshift({"label": cur._label, "obj": cur});
    cur = cur._root;
  }

  position.unshift({"label":"Network", "obj": self});
  d3.select("#tree")
    .selectAll("li")
    .data(position)
    .enter()
    .append("li")
    .append("a")
    .text(function(d) {return d.label;})
    .on("click", function(d) {self._selected = d.obj; self.render(); });

  $("#tree")
    .children("li")
    .last()
    .attr("class", "netvis-path-selected");

  // Render properties-table
  $("#properties-tbody").empty();
  attributes = [];
  if (self._selected._propertiesAlias) {
    objTraversed = self._selected._propertiesAlias;
  } else {
    objTraversed = self._selected;
  }

  for (var key in objTraversed) {
    if (!objTraversed.hasOwnProperty(key)) {
      // inherited attribute, ignoring
      continue;
    }
    if (typeof(objTraversed[key]) == "function") {
      // attribute is a function, ignoring
      continue;
    }
    if (key.charAt(0) === "_") {
      // private attribute, ignoring
      continue;
    }
    attributes.push({"attr": key, "value":objTraversed[key], "obj": typeof(objTraversed[key]) == "object"});
  }

  rows = d3.select("#properties-tbody").selectAll("tr").data(attributes).enter().append("tr");

  valued = rows.filter(function(d) {return !d.obj;});
  valued.append("td").text(function(d) {return d.attr; });
  valued
    .append("td")
    .append("div")
    .attr("class","properties-column")
    .text(function(d) {return d.value; });

  rows.filter(function(d) {return d.obj;}).append("td").append("a").text(function(d) {return d.attr; })
  .on("click", function(d) {self._selected = d.value; self.render();});


  if (self._playmode) {
    $("#play").find("span").attr("class","glyphicon glyphicon-pause");
  } else {
    $("#play").find("span").attr("class","glyphicon glyphicon-play");
  }

  if (self.config.loopPlay) {
    $("#repeat").attr("class","btn btn-danger");
  } else {
    $("#repeat").attr("class","btn btn-active");
  }


  // move time-controls panel
  $("#history")
    .val(self._selectedTimeInterval.i + 1)
    .change();

  $("#timestamp")
    .html(self._selectedTimeInterval.humanTimeLabel);

};
