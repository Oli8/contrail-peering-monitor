var async = require('async');
var utils = require('../utils');
var IntrospecVRouterClient = require('../Client/IntrospecVRouterClient');
var Service = require('../Entity/Service');

// VRouterNode
var VRouterNode = function(name, dataSource){
  this.name = name;
  this.type = 'VRouterNode';
  this.introspecVRouterClient = new IntrospecVRouterClient(name);
  this.ipAddress = [];
  this.services = [];
}

var parseDiscoveryClientObject = function(objJSON, name){
  var filterType = ['contrail-vrouter-agent:0'];

  var nodesList = objJSON.services;
  nodesList = nodesList.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});

  var vRouterList = {
    ipAddress: [],
    services: []
  }
  var services = [];
  //console.log(require('util').inspect(nodesList, { depth: null }));
  for(i in nodesList){
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (services.indexOf(nodesList[i]['client_type'])==-1)){
      services.push(nodesList[i]['client_type']);
      vRouterList.services.push({name: nodesList[i]['client_type'], hostname: nodesList[i]['remote']});
    }
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (vRouterList.ipAddress.indexOf(nodesList[i]['remote'])==-1)){
      vRouterList.ipAddress.push(nodesList[i]['remote']);
    }
  }
  return vRouterList;
}

var parseDiscoveryObject = function(discoClientJSON, name){
  var vRouterList = parseDiscoveryClientObject(discoClientJSON, name);
  return vRouterList;
}

VRouterNode.prototype.update = function(discoClientJSON, discoServiceJSON){
  var self = this;
  var vRouterList = parseDiscoveryObject(discoClientJSON, this.name);
  this.ipAddress = vRouterList.ipAddress;
  for(i in vRouterList.services){
    self.services[i] = new Service(vRouterList.services[i]['name'], self.name);
  }
}

//@async
VRouterNode.prototype.checkServices = function(callback){
  var self = this;
  async.forEachOf(self.services, function(service, key, callback){
    service.check(callback);
  }, function(err){
    callback(null);
  });
}

//@async
VRouterNode.prototype.getIntrospec = function(callback){
  var self = this;
  self.introspecVRouterClient.get(callback);
}

var main = function(){
  var name = 'p-ocnclc-0001';
  var controlList = [
    {name: 'd-octcld-0000', ipAddress: '10.35.2.18'},
    {name: 'd-octcld-0001', ipAddress: '10.35.2.20'}
  ]
  utils.stdin(function(err, data){
    //console.log(data[0]);
    //var result = parseDiscoveryObject(data[1], data[0], name);
    var result = parseDiscoveryObject(data[0], name);
    console.log('##########################\n# Parse Discovery Object #\n##########################\n'+require('util').inspect(result, { depth: null }));
  });
}

if (require.main === module) {
  main();
}

module.exports = VRouterNode;

// VRouterNode.prototype.update = function(callback){
//   var self = this;
//   async.waterfall([
//     // href: url to request objJSON
//     async.apply(control.requestJSON, this.dataSource),
//     // objJSON: config JSON requested; callback: next function
//     function(objJSON, callback){
//       self.services = {};
//       for(i in objJSON.NodeStatus.process_status){
//         serv = objJSON.NodeStatus.process_status[i];
//         self.services[serv.module_id] = new Service(serv.module_id);
//         if(serv.state == 'Functional'){
//           self.services[serv.module_id].status = "OK";
//         }
//       }
//       callback(null);
//     }
//   ], function(err, obj){
//     callback(null);
//   });
// };
