var async = require('async');
var util = require('util');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var ConfigSet = require('./ConfigSet');
var ControlSet = require('./ControlSet');
var VRouterSet = require('./VRouterSet');
var control = require('./control');

global.config = {
  discovery : null,
  analytics : null,
  time : 4000
};

var initStructure = function(callback){
  global.contrailSet = {
    dataSource : global.config.discovery,
    configSet : [],
    controlSet : [],
    vRouterSet : [],
    nodes:{}
  };
  contrailSet.configSet = new ConfigSet('localhost');
  contrailSet.controlSet = new ControlSet(CONFIG.analytics);
  contrailSet.vRouterSet = new VRouterSet(CONFIG.analytics);
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

var initFromEnv = function(){
  global.config.discovery = process.env.CONTRAIL_DISCOVERY_URL ||
  process.env.CONTRAIL_DISCOVERY ||
  process.env.CONTRAIL_DISCO_URL ||
  process.env.CONTRAIL_DISCO ||
  process.env.DISCOVERY_URL;
}

var initFromOptions = function(program, callback){
  if(program.discovery){
    global.config.discovery = program.discovery;
  }
  if(program.analytics){
    global.config.analytics = program.analytics;
  }
  if(program.timeToRefresh){
    global.config.time = program.timeToRefresh;
  }
}

exports.run = _run;
exports.initFromOptions = initFromOptions;
exports.initFromEnv = initFromEnv;
//global.CONFIG = CONFIG;
