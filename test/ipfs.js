var tap = require('tap');


var netvis = require('../dist/NetVis.js');

var IPFSEntry = "{\"event\":\"sentMessage\",\"localPeer\":{\"id\":\"EiCsOiFNw0RDqkoNuVeGtGoz4JrHVdLoZhOBhU7dbaSOCg==\",\"latency\":0},\"message\":{\"type\":\"PING\"},\"system\":\"dht\",\"time\":\"2014-11-16T14:04:45.554426994Z\",\"remotePeer\":{\"id\":\"EiCwSlfUDsoTiAnxOadrEgRDM8N0A5HJvxzp2OIaeSEL/Q==\",\"latency\":0}}";
var NetVisEntry = "{\"event\":\"sentMessage\",\"loggerID\"EiCsOiFNw0RDqkoNuVeGtGoz4JrHVdLoZhOBhU7dbaSOCg==\",\"message\":{\"type\":\"PING\"},\"system\":\"dht\",\"time\":\"2014-11-16T14:04:45.554426994Z\",\"destinationID\":\"EiCwSlfUDsoTiAnxOadrEgRDM8N0A5HJvxzp2OIaeSEL/Q==\"}";
 

var adapterIPFS = netvis.NetVis.prototype.adapterIPFS;
tap.test('\nIPFS adapter: parsing sentMessage', function(t) {
		t.equal(adapterIPFS.convert(IPFSEntry, console), NetVisEntry);
		t.end();
});