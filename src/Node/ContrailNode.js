var EventEmitter = require('events').EventEmitter;
var util = require('util');
/**
 * Node Module
 *
 * @module Node
 */

/**
 * ContrailNode description ...
 *
 * @class ContrailNode
 * @constructor
 * @param {String} name name
 * @param {String} datasource datasource
 * @param {String} type type
 */
var ContrailNode = function(name, dataSource, type){
	/**
    * @property name
    * @type String
  	*/
	this.name = name;
	/**
    * @property datasource
    * @type String
  	*/
	this.dataSource = dataSource;
	/**
    * @property type
    * @type String
  	*/
	this.type = type;
}

/**
* ContrailNode toString description
*
* @method toString
* @return {String} ContrailNode string description
*/
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
