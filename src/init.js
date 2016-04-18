var async = require('async');
var util = require('util');
var unirest = require('unirest');

global.config = {
  discovery : null,
  analytics : null,
  time : 4000
};

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

exports.initFromOptions = initFromOptions;
exports.initFromEnv = initFromEnv;
//global.CONFIG = CONFIG;
