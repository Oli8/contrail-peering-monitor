var async = require('async');
var util = require('util');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var control = require('./control');

var _CONFIG = {
  analytics : null,
  time : 4000
};

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

var _initConfig = function(program, callback){
  if(!program.analytics){
    console.log("Error");
    process.exit();
  }
  if(program.time){
    _CONFIG.time = program.time;
  }
  _CONFIG.analytics = program.analytics;
  console.log(_CONFIG);
  callback(null);
}

exports.run = _run;
exports.initConfig = _initConfig;
global.CONFIG = _CONFIG;
