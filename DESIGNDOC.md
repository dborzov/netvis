# NetVis design document


### Initialization

Loading `netvis.js` within your browser:
```html
  <script src="dist/NetVis.js"></script>
```

enables netvis visualization object constructor:
```js
   myVisualization1 = new NetVis({})
```
that takes as an argument the Settings object where one can overwrite the default settings for the following parameters:
- **"topologyPanel":"#chart"**,  CSS-syntax identifier for DOM element (probably `<div>` panels) to render interactive [vector](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics) network topology chart
- **"historyPanel":"#history"**,  CSS-syntax identifier for playback controls and time slider
- **"traverserPanel":"#history"**,  CSS-syntax identifier for panel where properties of the selected model element are shown

### Parsing netvis files
Now one can load netvis entries with:
```js
  myVisualization1.parse(netvisFile);
```
where `netvisFile` is the parsed JSON.

### Controls API
The following "public" callback functions are available

#### Basic controls
Basic controls functions are on the root level and are the most commonly used ones.
- **netVis1.initView()** initializes visualization's rendering
- **netVis1.parse(netvisJSON)** load netvis files
- **netVis1.updateAll** rebuilds the whole state model from the loaded events: builds up the timeline, resolves the object links and so on
- **netVis1.resetPositions()** returns all the user-controlled parameters back to the default values, such as selections, object positions on the topology panel and so on
- **netVis1.play()** switches between the `play` and `pause` mode

A good usage example would be binding one of these functions to the event listener for a button:
```js
  $("#reset-positions").click(demo.resetPositions);
```

#### History
Functions concerning controlling timeline resolution and time intervals model.

- **netVis1.history.next()** move to the next timeinterval if available.
