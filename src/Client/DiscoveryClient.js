var async = require('async');
var util = require('util');
var requestJSON = require('../utils').requestJSON;

var DiscoveryClient = function(name){
  this.name = name;
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

// @async
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
    callback(null);
  });
}

//@async
DiscoveryClient.prototype.get = function(callback){
  var self = this;
  async.forEachOf(self.path, function(item, key, callback){
    //console.log('ITEM :'+key);
    self.getDataFromPath(key, callback);
  }, function(err){
    callback(null);
  });
}

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
