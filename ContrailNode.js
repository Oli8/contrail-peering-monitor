var EventEmitter = require('events').EventEmitter;
var util = require('util');


// ContrailNode
var ContrailNode = function(name, dataSource){
	this.name = name;
	this.dataSource = dataSource;
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
