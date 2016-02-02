// ContrailNode
var ContrailNode = function(name, ipAddress){
	this.ipAddress = ipAddress;
	this.name = name;
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
}
