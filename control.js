var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var Service = require('./Service');

var _requestJSON = function(href, callback){
  unirest.get(href)
  .header('application/json')
  .end(function(response){
     objJSON = response.body;
     callback(null, objJSON);
  });
};

var _updateContrailSet = function(callback){
  async.parallel([
    function(callback){
      contrailSet.configSet.update(callback);
    },
    function(callback){
      contrailSet.controlSet.update(callback);
    }
    // updateVrouter
  ], function(err, res){
    //console.log(contrailSet);
    contrailNode.updateEvent.emit('updateEvent');
    if(callback){
      callback(null);
    }
  });
}







exports.requestJSON = _requestJSON;
exports.updateContrailSet = _updateContrailSet;


/*
exports.run = function(callback){
  async.waterfall([
    updateConfigSet,
    function(callback){
      async.forEachOf(contrailSet.configSet, updateConfigNode, function(err, res){
        callback(null);
      });
    }
  ], function(err, res){
    callback(null);
  }
)
};
*/
