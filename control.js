var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');

exports.getConfigList = function(callback){
  unirest.get('http://d-oalcld-0000.adm.lab0.aub.cloudwatt.net:8081/analytics/uves/config-nodes')
  .header('application/json')
  .end(function(response){
     configListJSON = response.body;
     callback(null, configListJSON);
  });
};

exports.requestJSON = function(href, callback){
  unirest.get(href)
  .header('application/json')
  .end(function(response){
     objJSON = response.body;
     callback(null, objJSON);
  });
};

exports.run = function(callback){
  return;
}
