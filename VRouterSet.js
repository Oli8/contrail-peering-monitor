var async = require('async');
var control = require('./control');
var VRouterNode = require('./VRouterNode');

// VrouterNode
var VRouterSet = function(dataSource){
	this.dataSource = dataSource;
	this.nodes = [];
}

VRouterSet.prototype.deleteOutdatedNode = function(objJSON, callback){
  for(i in contrailSet.vRouterSet.nodes){
    var name = contrailSet.vRouterSet.nodes[i].name;
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
  callback(null)
}

VRouterSet.prototype.update = function(callback){
	var self = this;
	async.waterfall([
    function(callback){
      callback(null, self.dataSource);
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/vrouters';
      callback(null, configUrl);
    },
    control.requestJSON,
    function(objJSON, callback){
      for(i in objJSON){
        var name = objJSON[i].name;
        if(!(name in contrailSet.nodes)){
          contrailSet.nodes[name] = new VRouterNode(name, objJSON[i].href);
          self.nodes.push(contrailSet.nodes[name]);
        }
      }
      callback(null, objJSON);
    },
    this.deleteOutdatedNode,
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
};

module.exports = VRouterSet;
