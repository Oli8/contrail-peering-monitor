var async = require('async');
var utils = require('../utils');
var IntrospecControlClient = require('../Client/IntrospecControlClient');
var Service = require('../Entity/Service');
/**
 * Node Module
 *
 * @module Node
 */

/**
 * ControlNode description ...
 *
 * @class ControlNode
 * @constructor
 * @param {String} name name
 */
var ControlNode = function(name){
  /**
  * @property name
  * @type String
  */
  this.name = name;
  /**
  * @property type
  * @type String
  */
  this.type = 'ControlNode';
  /**
  * @property introspecControlClient
  * @type Object
  */
  this.introspecControlClient = new IntrospecControlClient(name);
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
  this.ifmapPeer = {};
}

var parseDiscoveryClientObject = function(objJSON, name){
  var filterType = ['ControlNode', 'contrail-control'];

  var nodesList = objJSON.services;
  nodesList = nodesList.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});

  var controlList = {
    ipAddress: [],
    services: []
  }
  var services = [];
  //console.log(require('util').inspect(nodesList, { depth: null }));
  for(i in nodesList){
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (services.indexOf(nodesList[i]['client_type'])==-1)){
      services.push(nodesList[i]['client_type']);
      controlList.services.push({name: nodesList[i]['client_type'], hostname: nodesList[i]['remote']});
    }
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (controlList.ipAddress.indexOf(nodesList[i]['remote'])==-1)){
      controlList.ipAddress.push(nodesList[i]['remote']);
    }
  }
  return controlList;
}

var parseDiscoveryServiceObject = function(objJSON, name){
  var filterType = ['xmpp-server'];

  var nodesList = objJSON.services;
  nodesList = nodesList.filter(utils.clientTypeFilter, {field: 'service_type', filter: filterType});

  var controlList = {
    ipAddress: [],
    services: []
  }
  var services = [];
  //console.log(require('util').inspect(nodesList, { depth: null }));
  for(i in nodesList){
    if((nodesList[i]['service_id'].split(':')[0]==name)&&
    (services.indexOf(nodesList[i]['service_type'])==-1)){
      services.push(nodesList[i]['service_type']);
      controlList.services.push({name: nodesList[i]['service_type'], hostname: nodesList[i]['remote']});
    }
    if((nodesList[i]['service_id'].split(':')[0]==name)&&
    (controlList.ipAddress.indexOf(nodesList[i]['remote'])==-1)){
      controlList.ipAddress.push(nodesList[i]['remote']);
    }
  }
  return controlList;
}

var parseDiscoveryObject = function(discoClientJSON, discoServiceJSON, name){
  var controlList = parseDiscoveryClientObject(discoClientJSON, name);
  var otherControlList = parseDiscoveryServiceObject(discoServiceJSON, name);
  var otherServices = otherControlList.services;

  controlList.ipAddress = otherControlList.ipAddress;
  controlList.services = controlList.services.concat(otherServices);

  return controlList;
}

var parseIntrospecIfmap = function(introspecJSON){
  var status = null;
  var ifmapJSON = introspecJSON['IFMapPeerServerInfoResp']['ds_peer_info'][0];
  var ifmap = {
    peer: [],
    current: null
  };
  var ifmapPeer = ifmapJSON['IFMapDSPeerInfo'][0]['ds_peer_list'][0]['list'][0]['IFMapDSPeerInfoEntry'];
  for(i in ifmapPeer){
    status = 'Backup';
    if(JSON.parse(ifmapPeer[i]['in_use'][0]['_'])) status = 'Active';
    ifmap.peer.push({host: ifmapPeer[i]['host'][0]['_'], status: status});
  }
  ifmap.current = ifmapJSON['IFMapDSPeerInfo'][0]['current_peer'][0]['_'].split(':')[0];
  return ifmap;
}

var ipToHostnameIfmap = function(ifmapPeer, configList){
  // Check ifmap.peer
  for(i in ifmapPeer.peer){
    for(j in configList){
      if(ifmapPeer.peer[i].host == configList[j].ipAddress){
        ifmapPeer.peer[i].host = configList[j].name;
        break;
      }
    }
  }
  // Check ifmap.current
  for(j in configList){
    if(ifmapPeer.current == configList[j].ipAddress){
      ifmapPeer.current = configList[j].name;
      break;
    }
  }
  return ifmapPeer;
}

var updateIfmap = function(introspecJSON, configList){
  var ifmapPeer = parseIntrospecIfmap(introspecJSON);
  ifmapPeer = ipToHostnameIfmap(ifmapPeer, configList);
  return ifmapPeer;
}

/**
* update description
*
* @method update
* @param {Object} discoClientJSON an object
* @param {Object} discoServiceJSON an object
*/
ControlNode.prototype.update = function(discoClientJSON, discoServiceJSON){
  var self = this;
  var controlList = parseDiscoveryObject(discoClientJSON, discoServiceJSON, this.name);
  this.ipAddress = controlList.ipAddress;
  for(i in controlList.services){
    self.services[i] = new Service(controlList.services[i]['name'], self.name);
  }
}

/**
* updateFromIntrospec description
*
* @method updateFromIntrospec
* @param {Object} configList an object
*/
ControlNode.prototype.updateFromIntrospec = function(configList){
  var self = this;
  self.ifmapPeer = null;
  if(!self.introspecControlClient.path['/Snh_IFMapPeerServerInfoReq'].error){
    self.ifmapPeer = updateIfmap(self.introspecControlClient.path['/Snh_IFMapPeerServerInfoReq'].data, configList);
  }
}

/**
* getIntrospec description
*
* @async
* @method getIntrospec
* @param {Function} callback callback function
*/
ControlNode.prototype.getIntrospec = function(callback){
  var self = this;
  self.introspecControlClient.get(callback);
}

/**
* checkServices description
*
* @async
* @method checkServices
* @param {Function} callback callback function
*/
ControlNode.prototype.checkServices = function(callback){
  var self = this;
  async.forEachOf(self.services, function(service, key, callback){
    service.check(callback);
  }, function(err){
    callback(null);
  });
}

var main = function(){
  var name = 'd-octclc-0001';
  var configList = [
    {name: 'd-ocfcld-0000', ipAddress: '10.35.2.18'},
    {name: 'd-ocfcld-0001', ipAddress: '10.35.2.20'}
  ]
  utils.stdin(function(err, data){
    //console.log(data[0]);
    //var result = parseDiscoveryObject(data[1], data[0], name);
    var result = updateIfmap(data, configList);
    console.log('##########################\n# Parse Discovery Object #\n##########################\n'+require('util').inspect(result, { depth: null }));
  });
}

if (require.main === module) {
  main();
}

module.exports = ControlNode;
