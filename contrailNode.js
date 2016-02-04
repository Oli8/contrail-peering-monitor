var EventEmitter = require('events').EventEmitter;
var util = require('util');

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
};


// Event
var UpdateEmitter = function() {
  EventEmitter.call(this);
};

util.inherits(UpdateEmitter, EventEmitter);

var _updateEvent = new UpdateEmitter();

exports.updateEvent = _updateEvent;

// _updateEvent.on('updateEvent', function() {
//   console.log('UPDATE!');
// });
