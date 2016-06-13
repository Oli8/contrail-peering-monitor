var async = require('async');
var util = require('util');
var unirest = require('unirest');
var externalConfig = require('../config/contrail-peering-monitor.json');

global.config = {
  discovery : null,
  analytics : null,
  timeout : 5000,
  refreshTime : 5500
};

var initFromExtConfig = function(){
  global.config.discovery = externalConfig.location["contrail-discovery"];
}

var initFromEnv = function(){
  global.config.discovery = process.env.CONTRAIL_DISCOVERY_URL ||
  process.env.CONTRAIL_DISCOVERY ||
  process.env.CONTRAIL_DISCO_URL ||
  process.env.CONTRAIL_DISCO ||
  process.env.DISCOVERY_URL || global.config.discovery;
}

var initFromOptions = function(program){
  if(program.discovery){
    global.config.discovery = program.discovery;
  }
  if(program.analytics){
    global.config.analytics = program.analytics;
  }
  if(program.timeout){
    global.config.timeout = program.timeout;
  }
  if(program.refreshTime){
    global.config.refreshTime = program.refreshTime;
  }
}

var checkConfig = function(){
  if(!global.config.discovery){
    console.log('You have to precise DISCOVERY');
    process.exit(1);
  }
}

exports.initFromExtConfig = initFromExtConfig;
exports.initFromOptions = initFromOptions;
exports.initFromEnv = initFromEnv;
exports.checkConfig = checkConfig;
//global.CONFIG = CONFIG;
