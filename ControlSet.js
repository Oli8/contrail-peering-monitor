var async = require('async');
var control = require('./control');
var ControlNode = require('./ControlNode');

// ControlSet
var ControlSet = function(dataSource){
	this.dataSource = dataSource;
	this.nodes = [];
}

ControlSet.prototype.deleteOutdatedNode = function(objJSON, callback){
  for(i in contrailSet.controlSet.nodes){
    var name = contrailSet.controlSet.nodes[i].name;
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

ControlSet.prototype.update = function(callback){
	var controlSet = this;
	async.waterfall([
    function(callback){
      callback(null, controlSet.dataSource);
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/control-nodes';
      callback(null, configUrl);
    },
    control.requestJSON,
    function(objJSON, callback){
      for(i in objJSON){
        var name = objJSON[i].name;
        if(!(name in contrailSet.nodes)){
          contrailSet.nodes[name] = new ControlNode(name, objJSON[i].href);
          controlSet.nodes.push(contrailSet.nodes[name]);
        }
      }
      callback(null, objJSON);
    },
    this.deleteOutdatedNode,
    function(callback){
      async.forEachOf(controlSet.nodes, function(node, index, callback){
				node.update(callback);
			}, function(err, res){
        callback(null);
      });
    }
  ], function(err, res){
    callback(null);
  });
};

module.exports = ControlSet;
