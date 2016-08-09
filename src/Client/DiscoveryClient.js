var async = require('async');
var util = require('util');
var requestJSON = require('../utils').requestJSON;
/**
 * Client Module
 *
 * @module Client
 */

/**
 * DiscoveryClient description ...
 *
 * @class DiscoveryClient
 * @constructor
 * @param {String} name name
 */
var DiscoveryClient = function(name){
  /**
  * @property name
  * @type String
  */
  this.name = name;
  /**
  * @property path
  * @type Object
  */
  this.path = {};
  this.path['/clients.json']= {
    data : {},
    url : "http://"+name+":5998/clients.json"
  }
  this.path['/services.json']= {
    data : {},
    url : "http://"+name+":5998/services.json"
  }
}

/**
* getDataFromPath description 
*
* @async
* @method getDataFromPath
* @param {String} path path of something
* @param {Function} callback callback function
*/ 
DiscoveryClient.prototype.getDataFromPath = function(path, callback){
  var self = this;
  //console.log(require('util').inspect(this, { depth: 2 }));
  async.waterfall([
    async.apply(requestJSON, self.path[path].url),
    function(objJSON, callback){
      self.path[path].data = objJSON;
      callback(null);
    }
  ],function(err){
    callback(err);
  });
}

/**
* DiscoveryClient get description
*
* @async
* @method get
* @param {Function} callback callback function
*/
DiscoveryClient.prototype.get = function(callback){
  var self = this;
  async.forEachOf(self.path, function(item, key, callback){
    //console.log('ITEM :'+key);
    self.getDataFromPath(key, callback);
  }, function(err){
    callback(err);
  });
}

/**
* DiscoveryClient toString description
*
* @method toString
* @return {String} DiscoveryClient string description
*/
DiscoveryClient.prototype.toString = function(){
  return "###################\n# DiscoveryClient #\n###################\nName: "+this.name+"\nData:"+util.inspect(this.path, false, 4, true);
}

// main code
var main = function(){
  var disco = new DiscoveryClient('localhost');
  async.waterfall([
    function(callback){
      disco.get(callback);
    }
  ],function(err){
    console.log(""+disco);
  });
}

if (require.main === module) {
  main();
}

module.exports = DiscoveryClient;
