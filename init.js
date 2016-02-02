var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var control = require('./control');
var util = require('util');

//////////////////////////////////////////////////////////////////////////
// NEW

global.contrailSet;

var initStructure = function(callback){
  contrailSet = {
    configSet : [],
    controlSet : [],
    vRouterSet : [],
    nodes:{}
  };
  callback(null);
}

var initContrailSet = function(callback){
  async.parallel([
    updateConfigSet
    // updateControl
    // updateVrouter
  ], function(err, res){
    callback(null);
  });
}

var deleteOutdatedNode = function(objJSON, callback){
  for(i in contrailSet.configSet){
    var name = contrailSet.configSet[i].name;
    var isDelete = true;
    for(j in objJSON){
      if(objJSON[j].name == name){
        isDelete = false;
        break;
      }
    }
    if(isDelete){
      delete contrailSet.configSet[i];
      delete contrailSet.nodes[name];
    }
  }
  callback(null)
}

var updateConfigNode = function(ele, index, callback){
  async.waterfall([
    // href: url to request objJSON
    async.apply(control.requestJSON, ele.href),
    // objJSON: config JSON requested; callback: next function
    function(objJSON, callback){
      var configNode = ele;
      for(i in objJSON.NodeStatus.process_status){
        serv = objJSON.NodeStatus.process_status[i];
        configNode.services[serv.module_id] = new contrailNode.Service(serv.module_id);
        if(serv.state == 'Functional'){
          configNode.services[serv.module_id].status = "OK";
        }
      }
      // Set config IP address
      configNode.ipAddress = objJSON.ModuleCpuState.config_node_ip;
      // Update global config node object
      //exports.configNodeTab[index] = configNode;
      callback(null);
    }
  ], function(err, obj){
    callback(null);
  });
};

var updateConfigSet = function(callback){
  async.waterfall([
    function(callback){
      callback(null, 'd-oalcld-0000.adm.lab0.aub.cloudwatt.net');
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/config-nodes';
      callback(null, configUrl);
    },
    control.requestJSON,
    function(objJSON, callback){
      for(i in objJSON){
        var name = objJSON[i].name;
        if(!(name in contrailSet.nodes)){
          contrailSet.nodes[name] = new contrailNode.ConfigNode(name);
          contrailSet.nodes[name].href = objJSON[i].href;
          contrailSet.configSet.push(contrailSet.nodes[name]);
        }
      }
      callback(null, objJSON);
    },
    deleteOutdatedNode,
    function(callback){
      //console.log(contrailSet);
      async.forEachOf(contrailSet.configSet, updateConfigNode, function(err, res){
        callback(null);
      });
    }
  ], function(err, res){
    callback(null);
  });
}


exports._run = function(callback){
  async.waterfall([
    initStructure,
    initContrailSet
  ], function(err, res){
    console.log(util.inspect(contrailSet, false, null));
    callback(null);
  });
}

//_run();
