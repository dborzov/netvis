// adapterIPFS implements
// NetVis adapter interface for IPFS log files


NetVis.prototype.adapterIPFS = {
	name: "IPFS",
	convert: function(IPFSlog, logger) {
		var NetVisJSON = [];
		entries = IPFSlog.split("\n");
		for (var i =0; i< entries.length; i++) {
			try{
				entry = JSON.parse(entries[i]);
			}
			catch(err){
				logger.error("NetVis Adapter ", this.name, ": failure to parse \"", entries[i],"\" as valid JSON");
				continue;
			}

			if (entry.event === "sentMessage") {
				entry.loggerID = entry.localPeer.id;
				delete entry.localPeer;
				entry.destinationNode = entry.remotePeer.id;
				delete entry.remotePeer;
			}

			NetVisJSON.push(entry);
		}
	}  
};





