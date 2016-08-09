var async = require('async');
var utils = require('../utils');
var IntrospecVRouterClient = require('../Client/IntrospecVRouterClient');
var Service = require('../Entity/Service');
/**
 * Node Module
 *
 * @module Node
 */

/**
 * VRouterNode description ...
 *
 * @class VRouterNode
 * @constructor
 * @param {String} name name
 * @param {String} datasource datasource
 */
var VRouterNode = function(name, dataSource){
  /**
  * @property name
  * @type String
  */
  this.name = name;
  /**
  * @property type
  * @type String
  */
  this.type = 'VRouterNode';
  /**
  * @property introspecControlClient
  * @type Object
  */
  this.introspecVRouterClient = new IntrospecVRouterClient(name);
  /**
  * @property ipAddress
  * @type Array
  */
  this.ipAddress = [];
  /**
  * @property services
  * @type Array
  */
  this.services = [];
  /**
  * @property ifmapPeer
  * @type Pbject
  */
  this.xmppPeer = {};
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

var parseIntrospecXmpp = function(introspecJSON){
  var status = null;
  var xmppPeer = introspecJSON['AgentXmppConnectionStatus']['peer'][0]['list'][0]['AgentXmppData'];
  var xmpp = {
    active: null,
    backup: null
  };
  for(i in xmppPeer){
    status = 'Backup';
    if(xmppPeer[i]['cfg_controller'][0]['_'] == 'Yes'){
      xmpp.active = xmppPeer[i]['controller_ip'][0]['_'];
      continue;
    }
    if(xmppPeer[i]['cfg_controller'][0]['_'] == 'No'){
      xmpp.backup = xmppPeer[i]['controller_ip'][0]['_'];
      continue;
    }
  }
  return xmpp;
}

var ipToHostnameXmpp = function(xmppPeer, controlList){
  for(i in controlList){
    if(xmppPeer.active == controlList[i].ipAddress){
      xmppPeer.active = controlList[i].name;
    }
    if(xmppPeer.backup == controlList[i].ipAddress){
      xmppPeer.backup = controlList[i].name;
    }
  }
  return xmppPeer;
}

var updateXmpp = function(introspecJSON, controlList){
  var xmppPeer = parseIntrospecXmpp(introspecJSON);
  xmppPeer = ipToHostnameXmpp(xmppPeer, controlList);
  return xmppPeer;
}

/**
* update description
*
* @method update
* @param {Object} discoClientJSON an object
* @param {Object} discoServiceJSON an object
*/
VRouterNode.prototype.update = function(discoClientJSON, discoServiceJSON){
  var self = this;
  var vRouterList = parseDiscoveryObject(discoClientJSON, this.name);
  this.ipAddress = vRouterList.ipAddress;
  for(i in vRouterList.services){
    self.services[i] = new Service(vRouterList.services[i]['name'], self.name);
  }
}

/**
* updateFromIntrospec description
*
* @method updateFromIntrospec
* @param {Object} controlList an object
*/
VRouterNode.prototype.updateFromIntrospec = function(controlList){
  var self = this;
  self.xmppPeer = null;
  if(!self.introspecVRouterClient.path['/Snh_AgentXmppConnectionStatusReq'].error){
    self.xmppPeer = updateXmpp(self.introspecVRouterClient.path['/Snh_AgentXmppConnectionStatusReq'].data, controlList);
  }
}

/**
* checkServices description
*
* @async
* @method checkServices
* @param {Function} callback callback function
*/
VRouterNode.prototype.checkServices = function(callback){
  var self = this;
  async.forEachOf(self.services, function(service, key, callback){
    service.check(callback);
  }, function(err){
    callback(null);
  });
}

/**
* getIntrospec description
*
* @async
* @method getIntrospec
* @param {Function} callback callback function
*/
VRouterNode.prototype.getIntrospec = function(callback){
  var self = this;
  self.introspecVRouterClient.get(callback);
}

var main = function(){
  var name = 'p-ocnclc-0001';
  var controlList = [
    {name: 'd-octcld-0000', ipAddress: '10.35.2.19'},
    {name: 'd-octcld-0001', ipAddress: '10.35.2.24'}
  ]
  utils.stdin(function(err, data){
    //console.log(data[0]);
    //var result = parseDiscoveryObject(data[1], data[0], name);
    //var result = parseDiscoveryObject(data[0], name);
    var result = updateXmpp(data, controlList);
    //result = ipToHostnameXmpp(result, controlList);
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
