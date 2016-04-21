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

var initFromOptions = function(program){
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

var checkConfig = function(){
  if(!global.config.discovery){
    console.log('You have to precise DISCOVERY');
    process.exit(1);
  }
}

exports.initFromOptions = initFromOptions;
exports.initFromEnv = initFromEnv;
exports.checkConfig = checkConfig;
//global.CONFIG = CONFIG;
