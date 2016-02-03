var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var control = require('./control');
var util = require('util');

//////////////////////////////////////////////////////////////////////////
// NEW

//global.contrailSet;

var initStructure = function(callback){
  global.contrailSet = {
    configSet : [],
    controlSet : [],
    vRouterSet : [],
    nodes:{}
  };
  callback(null);
}

var _run = function(callback){
  async.waterfall([
    initStructure,
    control.updateContrailSet
  ], function(err, res){
    callback(null);
  });
}

exports.run = _run;
