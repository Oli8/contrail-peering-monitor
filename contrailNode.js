var EventEmitter = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var control = require('./control');

// ContrailNode
var ContrailNode = function(name, dataSource){
	this.name = name;
	this.dataSource = dataSource;
}

// ConfigNode
exports.ConfigNode = function(name){
	this.name = name;
	this.type = 'config';
	this.href = '';
	this.ipAddress = [];
	this.services = {};
}

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
