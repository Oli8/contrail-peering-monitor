var EventEmitter = require('events').EventEmitter;
var util = require('util');


// ContrailNode
var ContrailNode = function(name, dataSource, type){
	this.name = name;
	this.dataSource = dataSource;
	this.type = type;
}
ContrailNode.prototype.toString = function(){
  return this.type+" : "+this.name;
}

// Event
var UpdateEmitter = function() {
  EventEmitter.call(this);
};

util.inherits(UpdateEmitter, EventEmitter);

var updateEvent = new UpdateEmitter();

exports.updateEvent = updateEvent;

// _updateEvent.on('updateEvent', function() {
//   console.log('UPDATE!');
// });
