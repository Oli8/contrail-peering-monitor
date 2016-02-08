var EventEmitter = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var control = require('./control');

// ContrailNode
var ContrailNode = function(name, dataSource){
	this.name = name;
	this.dataSource = dataSource;
}

// ConfigNode
exports.ConfigNode = function(name){
	this.name = name;
	this.type = 'config';
	this.href = '';
	this.ipAddress = [];
	this.services = {};
}

// Process
exports.Service = function(name){
	this.name = name;
	this.status = "FAILED";
}

//status:bool
var setStatus = function(status){
	this.status = status;
};

// ControlNode
exports.ControlNode = function(name, dataSource){
	this.name = name;
	this.dataSource = dataSource;
	this.type = 'control';
	this.services = {};
}

exports.ControlNode.prototype.update = function(callback){
	var node = this;
	async.waterfall([
    // href: url to request objJSON
    async.apply(control.requestJSON, this.dataSource),
    // objJSON: config JSON requested; callback: next function
    function(objJSON, callback){
      for(i in objJSON.NodeStatus.process_status){
        serv = objJSON.NodeStatus.process_status[i];
        node.services[serv.module_id] = new exports.Service(serv.module_id);
        if(serv.state == 'Functional'){
          node.services[serv.module_id].status = "OK";
        }
      }
      callback(null);
    }
  ], function(err, obj){
    callback(null);
  });
};

// ControlSet
_ControlSet = function(dataSource){
	this.dataSource = dataSource;
	this.nodes = [];
}

_ControlSet.prototype.deleteOutdatedNode = function(objJSON, callback){
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

_ControlSet.prototype.update = function(callback){
	var controlSet = this;
	async.waterfall([
    function(callback){
      callback(null, controlSet.dataSource);
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/control-nodes';
			console.log(configUrl);
      callback(null, configUrl);
    },
    control.requestJSON,
    function(objJSON, callback){
      for(i in objJSON){
        var name = objJSON[i].name;
        if(!(name in contrailSet.nodes)){
          contrailSet.nodes[name] = new exports.ControlNode(name, objJSON[i].href);
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

// Event
var UpdateEmitter = function() {
  EventEmitter.call(this);
};

util.inherits(UpdateEmitter, EventEmitter);

var _updateEvent = new UpdateEmitter();

exports.updateEvent = _updateEvent;
exports.ControlSet = _ControlSet;

// _updateEvent.on('updateEvent', function() {
//   console.log('UPDATE!');
// });
