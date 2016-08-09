var async = require('async');
var utils = require('../utils')
var externalConfig = require('../../config/contrail-peering-monitor.json');
/**
 * Entity Module
 *
 * @module Entity
 */

 /**
 * Service description ...
 *
 * @class Service
 * @constructor
 * @param {String} name name
 * @param {String} hostname hostname
 */
var Service = function(name, hostname){
	/**
  	* @property name
  	* @type String
  	*/
	this.name = name;
	/**
  	* @property hostname
  	* @type String
  	*/
	this.hostname = hostname;
	/**
  	* @property port
  	* @type String
  	*/
	this.port = externalConfig.port[name];
	/**
  	* @property status
  	* @type String
  	*/
	this.status = "DOWN";
}

/**
* Service get description
*
* @async
* @method check
* @param {Function} callback callback function
*/
Service.prototype.check = function(callback){
	var self = this;
	async.waterfall([
		async.apply(utils.portScan, self.port, self.hostname),
		function(status, callback){
			if(status == "open"){
				self.status = "UP";
			}
			else{
				self.status = "DOWN";
			}
			callback(null);
		}
	], function(err){
		callback(null);
	});
}

/**
* Service get description
*
* @method setStatus
* @param {String} status new status' name 
*/
Service.prototype.setStatus = function(status){
	this.status = status;
}

/**
* Service toString description
*
* @method toString
* @return {String} Service string description
*/
Service.prototype.toString = function(){
	return "Service:"+this.name+" Status:"+this.status;
}

// TO TEST
// args: {serviceName, hostName}
var main = function(){
	var args = {
		serviceName:'contrail-discovery',
		hostName:'localhost'
	}
	var service = new Service(args.serviceName, args.hostName);
	console.log(service);
	service.check(function(err){
		console.log('#################\n# Check Service #\n##################\n'+require('util').inspect(service, { depth: null }));
	});
}

if (require.main === module) {
	main();
}

module.exports = Service;
