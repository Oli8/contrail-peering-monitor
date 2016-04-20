var async = require('async');
var utils = require('../utils');
var VRouterNode = require('../Node/VRouterNode');

// VrouterSet
var VRouterSet = function(){
	this.nodes = [];
	this.type = "VRouterSet";
}

var parseDiscoveryObject = function(objJSON){
	var filterType = ['contrail-vrouter-agent:0'];

	var nodesJSON = objJSON.services;
	var vRouterList = nodesJSON.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});
	for(i in vRouterList){
		vRouterList[i] = vRouterList[i]['client_id'].split(':')[0];
	}
	vRouterList = utils.uniq(vRouterList);
	return vRouterList;
}

VRouterSet.prototype.exist = function(name){
	for(i in this.nodes){
		if(this.nodes[i].name==name){
			return true;
		}
	}
	return false;
}

VRouterSet.prototype.deleteOutdatedNode = function(nodeList){
	for(i in this.nodes){
		var name = this.nodes[i].name;

		if(nodeList.indexOf(name)==-1){
			delete this.nodes[i];
		}
	}
}

VRouterSet.prototype.update = function(discoClientJSON, discoServiceJSON, callback){
	var self = this;
	var vRouterList = parseDiscoveryObject(discoClientJSON);

	for(i in vRouterList){
		var name = vRouterList[i];
		if(!self.exist(name)){
			self.nodes.push(new VRouterNode(name));
		}
	}

	self.deleteOutdatedNode(vRouterList);

	for(i in self.nodes){
		self.nodes[i].update(discoClientJSON, discoServiceJSON);
	}
	callback(null);
}

//@async
VRouterSet.prototype.getIntrospec = function(callback){
	var self = this;
  async.forEachOf(self.nodes, function(node, key, callback){
    node.getIntrospec(callback);
  }, function(err){
    callback(null);
  });
}

//@async
VRouterSet.prototype.checkServices = function(callback){
	var self = this;
  async.forEachOf(self.nodes, function(node, key, callback){
    node.checkServices(callback);
  }, function(err){
    callback(null);
  });
}

var main = function(){
	utils.stdin(function(err, data){
		var result = parseDiscoveryObject(data[0]);
		console.log('##########################\n# Parse Discovery Object #\n##########################\n'+result);
	});
}

if (require.main === module) {
  main();
}

module.exports = VRouterSet;
// VRouterSet.prototype.update = function(callback){
// 	var self = this;
// 	async.waterfall([
//     function(callback){
//       callback(null, self.dataSource);
//     },
//     function(url, callback){
//       configUrl = 'http://' + url + ':8081/analytics/uves/vrouters';
//       callback(null, configUrl);
//     },
//     control.requestJSON,
//     function(objJSON, callback){
//       for(i in objJSON){
//         var name = objJSON[i].name;
//         if(!(name in contrailSet.nodes)){
//           contrailSet.nodes[name] = new VRouterNode(name, objJSON[i].href);
//           self.nodes.push(contrailSet.nodes[name]);
//         }
//       }
//       callback(null, objJSON);
//     },
//     this.deleteOutdatedNode,
//     function(callback){
//       async.forEachOf(self.nodes, function(node, index, callback){
// 				node.update(callback);
// 			}, function(err, res){
//         callback(null);
//       });
//     }
//   ], function(err, res){
//     callback(null);
//   });
// };
