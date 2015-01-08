NetVis
======
( good place to start is [the showcasing page](http://dborzov.github.io/netvis).)

NetVis is a highly customizable javascript framework for building interactive network visualizations:

* Visualize any network activity by describing your network events in a straightforward JSON-based NetVis format detailing network nodes, events and messages.

* Convert your server logs / network trace files to NetVis format and quickly visualize them.
Generic nature of the tool means support for visualizing communication in any existing protocols, including IP, TCP, HTTP, TSL, BitCoin or IPFS as well as a pefrect tool for  developing new network protocols.

* Browse and traverse your network model with the d3-based graph visualization and time playback controls (play/pause/ffwd/rwind/speed) for events.

* Customize the looks and appearance easily by overwriting the default View handlers in plain javascript. NetVis maintains the form and function customization separate. Specifying custom colors and tags for nodes and messages, or things like depicting the nodes on the georgaphical map is super simple.


NetVis is built by the IPFS (ipfs.io, github.com/jbenet/ipfs) and Filecoin (filecoin.io) team.

What can NetVis do for me?
-------------

Here is an example of the use case:

1. Live nodes implementing protocols run, generating a real sequence of events. They store this sequence in one or many log files.
2. The log files are consolidated into one netvis history.
3. The history is fed into a simulator, which runs the visualization.

This means that the live nodes / producers need not emit netvis exactly; we can have a processing step in the pipeline that converts whatever the native protocol logs are into netvis. (for example, combining two differet entries, announcing an outgoing + incoming packet, into one single netvis message entry)

And it also means that simulators need not ingest netvis directly, but can also be processed to fit their purposes better. This makes netvis a middle-format that seeks to ensure all the necessary elements are present, and that both the producer and consumer programs handle them correctly.


netvis pipeline:

    live nodes --> logs --> netvis logs --> simulator input --> simulator



NetVis format
------------
See the [specififcation draft](netvis.md).

Here is an example of a NetVis file:

```json
  [
    {
      "time": "2014-11-12T11:34:01.077817100Z",
      "loggerID":"QmdqaPCyuyAD2DNGGVTEdUmH33sBF62YpSM7oWi1CoCkm8",
      "level": "info",
      "event":"nodeEntered",
      "name": "Earth"
    },

    {
      "time": "2014-11-12T11:34:01.477817180Z",
      "loggerID":"QmdqaPCyuyAD2DNGGVTEdUmH33sBF62YpSM7oWi1CoCkm8",
      "level": "info",
      "event":"messageSent",
      "destinationNode": "Qmd9uGaZ6vKTES5nezVyCZDP2zJzdii2EXWiCbyGYq1tZX",
      "message":
      {
          "request_id": "c655d844aed528caabfad155408ee5832ba64d78",
          "time": "2014-11-12T11:34:01.477817180Z",
          "protocol": "IPFS 0.1",
          "type": "join",
          "contents": "{\"body\":\"Hello Jupiter!This is Earth, bow to our might!\"}"
      }
    },

    {
      "time": "2014-11-12T11:34:02.000000003Z",
      "loggerID":"QmdqaPCyuyAD2DNGGVTEdUmH33sBF62YpSM7oWi1CoCkm8",
      "level": "info",
      "event":"messageReceived",
      "sourceNode": "Qmd9uGaZ6vKTES5nezVyCZDP2zJzdii2EXWiCbyGYq1tZX",
      "message":
      {
          "request_id": "a001c4d79b323808729ecfe673d84048e1725b39a96049dce2241dbd11d6abf9",
          "time": "2014-11-12T11:34:01.900000003Z",
          "protocol": "IPFS 0.1",
          "type": "lol",
          "contents": "lol wat"
      }
    }
  ]

```

We see an example of simple network activity where a node "Earth" sends a message to "Jupiter" and get a response.

Note that while the Earth node is defined with a `nodeEntered` event, Jupiter is only introduced implicitely, by being mentioned. That is acceptable, NetVis tries to deduce things as much as possible.


Other
----------------
Also see:
- **[DESIGNDOC.md](DESIGNDOC.md)** - netvis project design and API doc
- **[netvis.md](netvis.md)** netvis network log file format specification
- **[ROADMAP.md](ROADMAP.md)**, project development roadmap
- **[DEVELOPING.md](DEVELOPING.md)**, internal designdoc. If you are considering contributing, or just want to see how things work internally, awesome! That would be a good place to start.  


MIT license.
