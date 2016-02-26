var async = require('async');
var control = require('./control');
var Service = require('./Service');

// ConfigNode
var ConfigNode = function(name, dataSource){
  this.name = name;
  this.dataSource = dataSource;
  this.type = 'config';
  this.ipAddress = [];
  this.services = {};
}

ConfigNode.prototype.update = function(callback){
  var self = this;
  async.waterfall([
    // href: url to request objJSON
    async.apply(control.requestJSON, this.dataSource),
    // objJSON: config JSON requested; callback: next function
    function(objJSON, callback){
      self.services = {};
      for(i in objJSON.NodeStatus.process_status){
        serv = objJSON.NodeStatus.process_status[i];
        // console.log(serv.module_id +" + "+serv.state);
        self.services[serv.module_id] = new Service(serv.module_id);
        if(serv.state == 'Functional'){
          self.services[serv.module_id].status = "OK";
        }
      }
      callback(null);
    }
  ], function(err, obj){
    //console.log(self.name);
    //console.log(self.services);
    callback(null);
  });
};

ConfigNode.prototype.updateFromDisco = function(callback){
  var self = this;
  async.waterfall([
    // objJSON: config JSON requested; callback: next function
    function(callback){
      self.services = {};
      for(i in self.dataSource){
        var name = self.dataSource[i]['client_id'].split(':')[0];
        var service = self.dataSource[i]['client_id'].split(':')[1];
        if(name == self.name){
          self.services[service] = new Service(service);
        }
      }
      callback(null);
    },
    function(callback){
      async.forEachOf(self.services, function(service, serviceName, callback){
        async.waterfall([
          async.apply(service, self.name), // service -> port
          utils.portScan,
          function(status, callback){
            if(status == open){
              service.status = 'OK';
            }
            callback(null);
          }
        ], function(err, obj){
          callback(null);
        }
      );
    }
  );
}
], function(err, obj){
  callback(null);
});
};
module.exports = ConfigNode;
