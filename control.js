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
    },
    function(callback){
      contrailSet.vRouterSet.update(callback);
    }
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
