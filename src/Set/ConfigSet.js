var async = require('async');
var utils = require('../utils');
var ConfigNode = require('../Node/ConfigNode');
/**
 * Set Module
 *
 * @module Set
 */

/**
 * ConfigSet description ...
 *
 * @class ConfigSet
 * @constructor
 */
var ConfigSet = function(){
	/**
	* @property nodes
	* @type Array
	*/
	this.nodes = [];
	/**
	* @property type
	* @type String
	*/
	this.type = "ConfigSet";
}

var parseDiscoveryObject = function(objJSON){
	var filterType = ['ApiServer', 'DiscoveryService', 'Service Monitor', 'Schema',
	'contrail-api', 'contrail-discovery', 'contrail-svc-monitor', 'contrail-schema'];

	var nodesJSON = objJSON.services;
	var configList = nodesJSON.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});
	for(i in configList){
		configList[i] = configList[i]['client_id'].split(':')[0];
	}
	configList = utils.uniq(configList);
	return configList;
}

/**
* Check if a node's name already exists
*
* @method exist
* @param {String} name name
* @return {Boolean} Return wether the name exists
*/
ConfigSet.prototype.exist = function(name){
	for(i in this.nodes){
		if(this.nodes[i].name==name){
			return true;
		}
	}
	return false;
}

/**
* Delete outdated node 
*
* @method deleteOutdatedNode
* @param {String} nodeList nodeList
*/
ConfigSet.prototype.deleteOutdatedNode = function(nodeList){
	for(i in this.nodes){
		var name = this.nodes[i].name;

		if(nodeList.indexOf(name)==-1){
			delete this.nodes[i];
		}
	}
}

//not async ?
/**
* update description
*
* @method update
* @param {Object} discoClientJSON an object
* @param {Object} discoServiceJSON an object
* @param {function} callback callback function
*/
ConfigSet.prototype.update = function(discoClientJSON, discoServiceJSON, callback){
	var self = this;
	var configList = parseDiscoveryObject(discoClientJSON);

	for(i in configList){
		var name = configList[i];
		if(!self.exist(name)){
			self.nodes.push(new ConfigNode(name));
		}
	}

	self.deleteOutdatedNode(configList);

	for(i in self.nodes){
		self.nodes[i].update(discoClientJSON, discoServiceJSON);
	}
	callback(null);
}

/**
* checkServices description
*
* @async
* @method checkServices
* @param {Function} callback callback function
*/
ConfigSet.prototype.checkServices = function(callback){
	var self = this;
  async.forEachOf(self.nodes, function(node, key, callback){
    node.checkServices(callback);
  }, function(err){
    callback(null);
  });
}

var main = function(){
	utils.stdin(function(err, data){
		var result = parseDiscoveryObject(data[0], data[1]);
		console.log('##########################\n# Parse Discovery Object #\n##########################\n'+result);
	});
}

if (require.main === module) {
  main();
}

module.exports = ConfigSet;

/*
TODO
ConfigSet.prototype.updateFromAnalytics = function(callback){
var self = this;
async.waterfall([
function(callback){
callback(null, self.dataSource);
},
function(url, callback){
configUrl = 'http://' + url + ':8081/analytics/uves/config-nodes';
callback(null, configUrl);
},
utils.requestJSON,
function(objJSON, callback){
for(i in objJSON){
var name = objJSON[i].name;
if(!(name in contrailSet.nodes)){
contrailSet.nodes[name] = new ConfigNode(name, objJSON[i].href);
self.nodes.push(contrailSet.nodes[name]);
}
}
callback(null, objJSON);
},
self.deleteOutdatedNode,
function(callback){
async.forEachOf(self.nodes, function(node, index, callback){
node.update(callback);
}, function(err, res){
callback(null);
});
}
], function(err, res){
callback(null);
});
}
*/
/*
ConfigSet.prototype.deleteOutdatedNode = function(objJSON, callback){
	for(i in contrailSet.configSet.nodes){
		var name = contrailSet.configSet.nodes[i].name;
		var isDelete = true;
		for(j in objJSON){
			if(objJSON[j].name == name){
				isDelete = false;
				break;
			}
		}
		if(isDelete){
			delete this.nodes[i];
			delete contrailSet.nodes[name];
		}
	}
	callback(null);
}
*/
