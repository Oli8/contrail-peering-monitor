var async = require('async');
var control = require('./control');
var Service = require('./Service');

// ControlNode
var VRouterNode = function(name, dataSource){
  this.name = name;
  this.dataSource = dataSource;
  this.type = 'vrouter';
  this.services = {};
}

VRouterNode.prototype.update = function(callback){
  var self = this;
  async.waterfall([
    // href: url to request objJSON
    async.apply(control.requestJSON, this.dataSource),
    // objJSON: config JSON requested; callback: next function
    function(objJSON, callback){
      self.services = {};
      for(i in objJSON.NodeStatus.process_status){
        serv = objJSON.NodeStatus.process_status[i];
        self.services[serv.module_id] = new Service(serv.module_id);
        if(serv.state == 'Functional'){
          self.services[serv.module_id].status = "OK";
        }
      }
      callback(null);
    }
  ], function(err, obj){
    callback(null);
  });
};

module.exports = VRouterNode;
