var async = require('async');
var utils = require('../utils')
var externalConfig = require('../../config/contrail-peering-monitor.json');

//Service
var Service = function(name, hostname){
	this.name = name;
	this.hostname = hostname;
	this.port = externalConfig.port[name];
	this.status = "DOWN";
}

//@async
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

Service.prototype.setStatus = function(status){
	this.status = status;
}

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
