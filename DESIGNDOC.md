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
The following "public" callback functions are available:
- **updateAll** rebuilds the whole state model from the loaded events: builds up the timeline, resolves the object links and so on
- **resetPositions** returns all the user-controlled parameters back to the default values, such as selections, object positions on the topology panel and so on
- **play** switches between the `play` and `pause` mode

A good usage example would be binding one of these functions to the event listener for a button:
```js
  $("#reset-positions").click(demo.resetPositions);
```
