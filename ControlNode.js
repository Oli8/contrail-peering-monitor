var async = require('async');
var control = require('./control');
var Service = require('./Service');

// ControlNode
var ControlNode = function(name, dataSource){
  this.name = name;
  this.dataSource = dataSource;
  this.type = 'control';
  this.services = {};
}

ControlNode.prototype.update = function(callback){
  var node = this;
  async.waterfall([
    // href: url to request objJSON
    async.apply(control.requestJSON, this.dataSource),
    // objJSON: config JSON requested; callback: next function
    function(objJSON, callback){
      for(i in objJSON.NodeStatus.process_status){
        serv = objJSON.NodeStatus.process_status[i];
        node.services[serv.module_id] = new Service(serv.module_id);
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

module.exports = ControlNode;
