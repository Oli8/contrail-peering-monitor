var async = require('async');
var utils = require('../utils');
var Service = require('../Entity/Service');
/**
 * Node Module
 *
 * @module Node
 */

/**
 * ConfigNode description ...
 *
 * @class ConfigNode
 * @constructor
 * @param {String} name name
 */
var ConfigNode = function(name){
  /**
    * @property name
    * @type String
  */
  this.name = name;
  /**
    * @property type
    * @type String
  */
  this.type = 'ConfigNode';
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
}

var parseDiscoveryClientObject = function(objJSON, name){
  var filterType = ['ApiServer', 'DiscoveryService', 'Service Monitor', 'Schema',
  'contrail-api', 'contrail-discovery', 'contrail-svc-monitor', 'contrail-schema'];

  var nodesList = objJSON.services;
  nodesList = nodesList.filter(utils.clientTypeFilter, {field: 'client_type', filter: filterType});

  var configList = {
    ipAddress: [],
    services: []
  }
  var services = [];
  //console.log(require('util').inspect(nodesList, { depth: null }));
  for(i in nodesList){
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (services.indexOf(nodesList[i]['client_type'])==-1)){
      services.push(nodesList[i]['client_type']);
      configList.services.push({name: nodesList[i]['client_type'], hostname: nodesList[i]['remote']});
    }
    if((nodesList[i]['client_id'].split(':')[0]==name)&&
    (configList.ipAddress.indexOf(nodesList[i]['remote'])==-1)){
      configList.ipAddress.push(nodesList[i]['remote']);
    }
  }
  return configList;
}

var parseDiscoveryServiceObject = function(objJSON, name){
  var filterType = ['IfmapServer', 'contrail-ifmap'];

  var nodesList = objJSON.services;
  nodesList = nodesList.filter(utils.clientTypeFilter, {field: 'service_type', filter: filterType});

  var configList = {
    services: []
  }
  var services = [];
  //console.log(require('util').inspect(nodesList, { depth: null }));
  for(i in nodesList){
    if((nodesList[i]['service_id'].split(':')[0]==name)&&
    (services.indexOf(nodesList[i]['service_type'])==-1)){
      services.push(nodesList[i]['service_type']);
      configList.services.push({name: nodesList[i]['service_type'], hostname: nodesList[i]['remote']});
    }
  }
  return configList;
}

var parseDiscoveryObject = function(discoClientJSON, discoServiceJSON, name){
  var configlist = parseDiscoveryClientObject(discoClientJSON, name);
  var otherServices = parseDiscoveryServiceObject(discoServiceJSON, name).services;

  configlist.services = configlist.services.concat(otherServices);

  return configlist;
}

/**
* update description
*
* @method update
* @param {Object} discoClientJSON an object
* @param {Object} discoServiceJSON an object
*/
ConfigNode.prototype.update = function(discoClientJSON, discoServiceJSON){
  var self = this;
  var configList = parseDiscoveryObject(discoClientJSON, discoServiceJSON, this.name);
  this.ipAddress = configList.ipAddress;
  for(i in configList.services){
    self.services[i] = new Service(configList.services[i]['name'], configList.services[i]['hostname']);
  }
}

/**
* checkServices description
*
* @async
* @method checkServices
* @param {Function} callback callback function
*/
ConfigNode.prototype.checkServices = function(callback){
  var self = this;
  async.forEachOf(self.services, function(service, key, callback){
    service.check(callback);
  }, function(err){
    callback(null);
  });
}

var main = function(){
  var name = 'd-ocfcld-0000';
	utils.stdin(function(err, data){
    //console.log(data[0]);
		var result = parseDiscoveryObject(data[1], data[0], name);
		console.log('##########################\n# Parse Discovery Object #\n##########################\n'+require('util').inspect(result, { depth: null }));
	});
}

if (require.main === module) {
  main();
}

module.exports = ConfigNode;

/*
ConfigNode.prototype.updateFromAnalytics = function(callback){
var self = this;
async.waterfall([
// href: url to request objJSON
async.apply(utils.requestJSON, this.dataSource),
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
}
*/
