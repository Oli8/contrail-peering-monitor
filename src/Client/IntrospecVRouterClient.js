var async = require('async');
var util = require('util');
var utils = require('../utils');

var IntrospecVRouterClient = function(name){
  this.name = name;
  this.path = {};
  this.path['/Snh_AgentXmppConnectionStatusReq']= {
    data : {},
    error : false,
    url : "http://"+name+":8085/Snh_AgentXmppConnectionStatusReq" // localhost --> name
  }
}

// @async
IntrospecVRouterClient.prototype.getDataFromPath = function(path, callback){
  var self = this;
  self.path[path].error = false;
  async.waterfall([
    async.apply(utils.requestXML, self.path[path].url),
    utils.xmlToJSON,
    function(objJSON, callback){
      self.path[path].data = objJSON;
      callback(null);
    }
  ],function(err){
    if(err){
      self.path[path].error = true;
    }
    callback(null);
  });
}

//@async
IntrospecVRouterClient.prototype.get = function(callback){
  var self = this;
  async.forEachOf(self.path, function(item, key, callback){
    //console.log('ITEM :'+key);
    self.getDataFromPath(key, callback);
  }, function(err){
    callback(null);
  });
}

IntrospecVRouterClient.prototype.toString = function(){
  return "##########################\n# IntrospecVRouterClient #\n##########################\nName: "+this.name+"\nData:"+util.inspect(this.path, false, null, true);
}

// main code
var main = function(){
  var introspec = new IntrospecVRouterClient('localhost');
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

module.exports = IntrospecVRouterClient;
