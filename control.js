var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');

var _requestJSON = function(href, callback){
  unirest.get(href)
  .header('application/json')
  .end(function(response){
     objJSON = response.body;
     callback(null, objJSON);
  });
};

var _updateContrailSet = function(callback){
  //console.log('This is the update');
  async.parallel([
    updateConfigSet
    // updateControl
    // updateVrouter
  ], function(err, res){
    contrailNode.updateEvent.emit('updateEvent');
    if(callback){
      callback(null);
    }
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
    async.apply(_requestJSON, ele.href),
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
      callback(null, 'd-oalcld-0000.adm.lab2.aub.cloudwatt.net');
    },
    function(url, callback){
      configUrl = 'http://' + url + ':8081/analytics/uves/config-nodes';
      callback(null, configUrl);
    },
    _requestJSON,
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
