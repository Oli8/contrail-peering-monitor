var async = require('async');
var control = require('./control');
var utils = require('./utils');
var ConfigNode = require('./ConfigNode');

var ConfigSet = function(dataSource){
	this.dataSource = dataSource;
	this.nodes = [];
}

ConfigSet.prototype.update = function(callback){
  var self = this;
  async.waterfall([
    function(callback){
      callback(null, self.dataSource);
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/config-nodes';
      callback(null, configUrl);
    },
    control.requestJSON,
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

ConfigSet.prototype.updateFromDisco = function(callback){
  var self = this;
	var filterType = ['ApiServer', 'DiscoveryService', 'Service Monitor', 'Schema'];

  async.waterfall([
    function(callback){
      callback(null, self.dataSource);
    },
    function(url, callback){
      configUrl = 'http://' + url + ':5998/clients.json';
      callback(null, configUrl);
    },
    control.requestJSON,
    function(objJSON, callback){
			var nodeList = objJSON.services;
			var configList = nodeList.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});
			for(i in configList){
				configList[i] = configList[i]['client_id'].split(':')[0];
			}
			configList = utils.uniq(configList);
      for(i in configList){
        var name = configList[i];
        if(!(name in contrailSet.nodes)){
          contrailSet.nodes[name] = new ConfigNode(name, nodeList);
          self.nodes.push(contrailSet.nodes[name]);
        }
      }
      callback(null, configList);
    },
    self.deleteOutdatedNodeFromDisco,
    function(callback){
      async.forEachOf(self.nodes, function(node, index, callback){
				node.updateFromDisco(callback);
			}, function(err, res){
        callback(null);
      });
    }
  ], function(err, res){
    callback(null);
  });
}

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

ConfigSet.prototype.deleteOutdatedNodeFromDisco = function(nodeList, callback){
	for(i in contrailSet.configSet.nodes){
    var name = contrailSet.configSet.nodes[i].name;

		if(!(name in nodeList)){
			delete this.nodes[i];
      delete contrailSet.nodes[name]
		}
  }
  callback(null);
}

module.exports = ConfigSet;
