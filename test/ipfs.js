var tap = require('tap');


var netvis = require('../dist/netvis.js');

var IPFSEntry = "{\"event\":\"sentMessage\",\"localPeer\":{\"id\":\"EiCsOiFNw0RDqkoNuVeGtGoz4JrHVdLoZhOBhU7dbaSOCg==\",\"latency\":0},\"message\":{\"type\":\"PING\"},\"system\":\"dht\",\"time\":\"2014-11-16T14:04:45.554426994Z\",\"remotePeer\":{\"id\":\"EiCwSlfUDsoTiAnxOadrEgRDM8N0A5HJvxzp2OIaeSEL/Q==\",\"latency\":0}}";
var NetVisEntry = "{\"event\":\"sentMessage\",\"loggerID\"EiCsOiFNw0RDqkoNuVeGtGoz4JrHVdLoZhOBhU7dbaSOCg==\",\"message\":{\"type\":\"PING\"},\"system\":\"dht\",\"time\":\"2014-11-16T14:04:45.554426994Z\",\"destinationID\":\"EiCwSlfUDsoTiAnxOadrEgRDM8N0A5HJvxzp2OIaeSEL/Q==\"}";
 

var adapterIPFS = netvis.NetVis.prototype.adapterIPFS;
tap.test('\nIPFS adapter: parsing sentMessage', function(t) {


		// convert 
		// Version should be detectable despite extra characters
		[
		['1.2.3', '1.2.3'],
		[' 1.2.3 ', '1.2.3'],
		[' 1.2.3-4 ', '1.2.3-4'],
		[' 1.2.3-pre ', '1.2.3-pre'],
		[' =v1.2.3 ', '1.2.3'],
		['v1.2.3', '1.2.3'],
		[' v1.2.3 ', '1.2.3'],
		['\t1.2.3', '1.2.3'],
		['>1.2.3', null],
		['~1.2.3', null],
		['<=1.2.3', null],
		['1.2.x', null]
		].forEach(function(tuple) {
		var range = tuple[0];
		var version = tuple[1];
		var msg = 'clean(' + range + ') = ' + version;
		t.equal(clean(range), version, msg);
		});
		t.end();
});