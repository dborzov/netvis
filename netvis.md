# Spec of the netvis format

The netvis format is just a sequence of objects that together describe the network and history. These can be the same file, or different files (e.g. multiple event histories over the same network). 

The aim of this format is to intermediate between network visualization tools, and the network protocols themselves. Processes running the protocol produce events in this format (either stored to log files or emitted via rpc). The visualization tools consume these events and playback the protocol. The aim is for this to be useful for both algorithmic network analysis, and -- primarily -- for visual, human analysis.

## Terminology

Before getting into the format, this terminology will help communicate ideas.

#### Records:

- `event` a network event, the building block of history.
- `history` a sequence of events, usually pertaining to one protocol, but possibly containing multiple.
- `producer` a process that emits (records or transmits) events
- `log` (or `trace`) a file storing an in-order sequence of events

#### Simulation:

- `network` a system of connected entities
- `node` an individual object in the network
- `message` information unit sent _from_ one node, to another

#### Nodes:

- `id` identifier for the node.
- `type` the (protocol specific) type for the node
- `addresses` a list of addresses the node has
- `state` opaque state for the node
- `enterTime` the (network) time at which the node entered
- `exitTime` the (network) time at which the node exited
- `messagesSent` the number of messages sent
- `messagesReceived` the number of messages received


#### Messages:

- `sourceNode` the node from which a message travels
- `destinationNode` the node to which a message travels
- `departureTime` the (network) time at which a message departed its source
- `arrivalTime` the (network) time at which it arrived at its destination
- `protocol` an identifier that describes the protocol the message belongs to
- `type` an identifier that describes the kind of message (protocol-specific)
- `size` the size of the message (in bytes)
- `contents` the actual state of the message

#### Events:

- `messageSent node msg` - a message is emitted from a node
- `messageReceived node msg` - a message is received by a node
- `messageDropped node msg` - a message is explicitly dropped by a node 
   as opposed to having been dropped in the network in between (fading)
- `nodeEntered` - a node entered the network (about to send messages)
- `nodeExited` - a node exited the network (no more messages)
- `nodeDialed addr` - a node dialed another node
- `nodeAccepted addr` - a node accepted another's dial
- `nodeConnected addr` - a node connected to another node
- `nodeDisconnected addr` - a node disconnected from another node
- `nodeStateChange diff` - a change of internal state in a node

#### Computing:

- `simulator` a process which consumes a `history` and simulates a network and its events
- `visualization` an animation of a network and/or a history ocurring over time.
- `netvis` this format
- `live node` a process running a program implementing the protocol (often a producer)
