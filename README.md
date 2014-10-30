prismo
======

An attempt at Network Sim Vis Tool: https://github.com/jbenet/random-ideas/issues/30

Netvis format: https://gist.github.com/jbenet/41092a3a55c44b9ed2c5

A visualizer of protocol traces to observe, debug, learn, ... admire... networks. Our main use case is for IPFS (ipfs.io, github.com/jbenet/ipfs) and Filecoin (filecoin.io). 
Rough scheme:

*    protocols output traces following a specific format detailing nodes + events
*    protocols can optionally specify viz layouts (e.g. DHT address ring vis, or force graph (based on latency))
*    d3 program consumes traces (could be live streams) in json and runs the simulation
*    simulation playback controls (play/pause/ffwd/rwind/speed)

The repo is under heavy development - nothing works, nothing's implemented yet.

General design
------------

Here is the tentative general design:
* It can follow the MVC(Model-View-Controller) pattern. The model part would store the state of the network with instances of Network Nodes, Messages/Packets they exchange, Connections and the Time Arrow to resolve and depict Events. So that we get:
```javascript
     > Prismo.Nodes.get("mars.i.ipfs.io")
     {
             name: "mars.i.ipfs.io",
             ip: "localhost",
            port:"8080",
            protocol:"HTTP 1.1"
     }
     > Prismo.Packets.get("df45-34fg")
     {
        "header":"GET /hi",
        "body": "is there anybody in there?"
     }
```
or something like that.
* The Controller Part would include parsers for the network traces that would update the model state accordingly. So you can feed it JSONs from external requests and see the model change accordingly. Or the user can interact with the visualization using page's UI and these actions would be converted into the same message JSON format and fed to the controller (it will follow `Message` format @jbenet suggested above). Something like that:
```javascript
   var event = {
       "type": "packet sent",
       "protocol":"HTTP 1.1",
       "recepient_ip":"localhost:8080",
       ...
   };
```
* The View part would render model into the d3.js-based visualization. It would include all the styling, selections and UI part handlers. 

I think the advantages of this approach are:
* The 3 separate domains (model, controller, view) are logically separate. So you can easily interchange them to support anyhting else  (like you can, say, rewrite View for shell and run if off Node.js)
*  easy generalization for various protocols (you just add parsers to the controllers to include your format of network's output traces)

Install
----------------
To build the library install `grunt-cli` and run:
```
    $ grunt 
```
This will concatinate all the js files into a single library file and put the result into `./dist` directory along with `index.html` for entry point. It will also watch all the source files for changes and update everything when needed.

We use `bower` to manage dependencies (install `d3.js`, `moment.js` and many others).