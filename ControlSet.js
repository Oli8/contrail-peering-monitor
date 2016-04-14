var async = require('async');
var utils = require('./utils');
var ControlNode = require('./ControlNode');

// ControlSet
var ControlSet = function(){
	this.nodes = [];
	this.types = 'ControlSet';
}

var parseDiscoveryObject = function(objJSON){
	var filterType = ['ControlNode', 'contrail-control'];

	var nodesJSON = objJSON.services;
	var controlList = nodesJSON.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});
	for(i in controlList){
		controlList[i] = controlList[i]['client_id'].split(':')[0];
	}
	controlList = utils.uniq(controlList);
	return controlList;
}

ControlSet.prototype.exist = function(name){
	for(i in this.nodes){
		if(this.nodes[i].name==name){
			return true;
		}
	}
	return false;
}

ControlSet.prototype.deleteOutdatedNode = function(nodeList){
	for(i in this.nodes){
		var name = this.nodes[i].name;

		if(nodeList.indexOf(name)==-1){
			delete this.nodes[i];
		}
	}
}

ControlSet.prototype.update = function(discoClientJSON, discoServiceJSON, callback){
	var self = this;
	var controlList = parseDiscoveryObject(discoClientJSON);

	for(i in controlList){
		var name = controlList[i];
		if(!self.exist(name)){
			self.nodes.push(new ControlNode(name));
		}
	}

	self.deleteOutdatedNode(controlList);

	for(i in self.nodes){
		self.nodes[i].update(discoClientJSON, discoServiceJSON);
	}
	callback(null);
}

//@async
ControlSet.prototype.checkServices = function(callback){
	var self = this;
  async.forEachOf(self.nodes, function(node, key, callback){
    node.checkServices(callback);
  }, function(err){
    callback(null);
  });
}

var main = function(){
	utils.stdin(function(err, data){
		var result = parseDiscoveryObject(data[1]);
		console.log('##########################\n# Parse Discovery Object #\n##########################\n'+result);
	});
}

if (require.main === module) {
  main();
}

module.exports = ControlSet;

// ControlSet.prototype.update = function(callback){
// 	var controlSet = this;
// 	async.waterfall([
//     function(callback){
//       callback(null, controlSet.dataSource);
//     },
//     function(url, callback){
//       configUrl = 'http://' + url + ':8081/analytics/uves/control-nodes';
//       callback(null, configUrl);
//     },
//     utils.requestJSON,
//     function(objJSON, callback){
//       for(i in objJSON){
//         var name = objJSON[i].name;
//         if(!(name in contrailSet.nodes)){
//           contrailSet.nodes[name] = new ControlNode(name, objJSON[i].href);
//           controlSet.nodes.push(contrailSet.nodes[name]);
//         }
//       }
//       callback(null, objJSON);
//     },
//     this.deleteOutdatedNode,
//     function(callback){
//       async.forEachOf(controlSet.nodes, function(node, index, callback){
// 				node.update(callback);
// 			}, function(err, res){
//         callback(null);
//       });
//     }
//   ], function(err, res){
//     callback(null);
//   });
// };
