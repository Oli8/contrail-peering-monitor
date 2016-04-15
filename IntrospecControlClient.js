var async = require('async');
var util = require('util');
var utils = require('./utils');

var IntrospecControlClient = function(name){
  this.name = name;
  this.path = {};
  this.path['/Snh_IFMapPeerServerInfoReq']= {
    data : {},
    url : "http://"+'localhost'+":8083/Snh_IFMapPeerServerInfoReq" // localhost --> name
  }
}

// @async
IntrospecControlClient.prototype.getDataFromPath = function(path, callback){
  var self = this;
  //console.log(require('util').inspect(this, { depth: 2 }));
  async.waterfall([
    async.apply(utils.requestXML, self.path[path].url),
    utils.xmlToJSON,
    function(objJSON, callback){
      self.path[path].data = objJSON;
      callback(null);
    }
  ],function(err){
    callback(null);
  });
}

//@async
IntrospecControlClient.prototype.get = function(callback){
  var self = this;
  async.forEachOf(self.path, function(item, key, callback){
    //console.log('ITEM :'+key);
    self.getDataFromPath(key, callback);
  }, function(err){
    callback(null);
  });
}

IntrospecControlClient.prototype.toString = function(){
  return "##########################\n# IntrospecControlClient #\n##########################\nName: "+this.name+"\nData:"+util.inspect(this.path, false, 4, true);
}

// main code
var main = function(){
  var introspec = new IntrospecControlClient('localhost');
  async.waterfall([
    function(callback){
      introspec.get(callback);
    }
  ],function(err){
    console.log(""+introspec);
  });
}

if (require.main === module) {
  main();
}

module.exports = IntrospecControlClient;
