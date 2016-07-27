var async = require('async');
var ConfigSet = require('./ConfigSet');
var ControlSet = require('./ControlSet');
var VRouterSet = require('./VRouterSet');
//var ContrailNode = require('../Node/ContrailNode');
var DiscoveryClient = require('../Client/DiscoveryClient');
var util = require('util');
/**
 * Set Module
 *
 * @module Set
 */

/**
 * ContrailSet description ...
 *
 * @class ContrailSet
 * @constructor
 * @param {String} discovery Name of the Discovery client instance
 * @param {String} eventEmitter eventEmitter
 */
var ContrailSet = function(discovery, eventEmitter){
  /**
  * @property eventEmitter
  * @type String
  */
  this.eventEmitter = eventEmitter;
  /**
  * @property discoveryClient
  * @type Object
  */
  this.discoveryClient = new DiscoveryClient(discovery);
  /**
  * @property configSet
  * @type Object
  */
  this.configSet = new ConfigSet();
  /**
  * @property ControlSet
  * @type Object
  */
  this.controlSet = new ControlSet();
  /**
  * @property VRouterSet
  * @type Object
  */
  this.vRouterSet = new VRouterSet();
  /**
  * @property nodes
  * @type Object
  */
  this.nodes = {};
  /**
  * @property error
  * @type 
  */
  this.error = null;
};

/**
* update description
*
* @method update
* @async
* @param {function} callback callback function
*/
ContrailSet.prototype.update = function(callback){
  var self = this;
  self.error = null;
  async.waterfall([
    function(callback){
      self.getJSON(callback);
    },
    function(callback){
      self.updateSet(callback);
    },
    function(callback){
      self.checkServices(callback);
    },
    function(callback){
      self.getIntrospec(callback);
    },
    function(callback){
      self.updateFromIntrospec(callback);
    }
  ], function(err){
    if(err){
      self.error = 'Discovery not responding';
    }
    //console.log(JSON.stringify(self.vRouterSet.nodes[0]));
    //process.exit(0);
    //self.eventEmitter.emit('updated', self);
    callback(null);
  });
}

/**
* getJSON description
*
* @async
* @method getJSON
* @param {function} callback callback function
*/
ContrailSet.prototype.getJSON = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.discoveryClient.get(callback);
    }
    //self.analyticsClient.get
  ], function(err){
    //console.log(""+self.discoveryClient);
    callback(err);
  });
}

/**
* updateSet description
*
* @async
* @method updateSet
* @param {function} callback callback function
*/
ContrailSet.prototype.updateSet = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.configSet.update(self.discoveryClient.path['/clients.json'].data, self.discoveryClient.path['/services.json'].data, callback);
    },
    function(callback){
      self.controlSet.update(self.discoveryClient.path['/clients.json'].data, self.discoveryClient.path['/services.json'].data, callback);
    },
    function(callback){
      self.vRouterSet.update(self.discoveryClient.path['/clients.json'].data, self.discoveryClient.path['/services.json'].data, callback);
    }
  ], function(err){
    callback(null);
  });
}

/**
* updateFromIntrospec description
*
* @async
* @method updateFromIntrospec
* @param {function} callback callback function
*/
ContrailSet.prototype.updateFromIntrospec = function(callback){
  var self = this;
  var configList = [];
  var controlList = [];
  for(i in self.configSet.nodes){
    configList.push({name: self.configSet.nodes[i].name, ipAddress: self.configSet.nodes[i].ipAddress[0]});
  }
  for(i in self.controlSet.nodes){
    controlList.push({name: self.controlSet.nodes[i].name, ipAddress: self.controlSet.nodes[i].ipAddress[0]});
  }
  async.waterfall([
    function(callback){
      self.controlSet.updateFromIntrospec(configList, callback);
    },
    function(callback){
      self.vRouterSet.updateFromIntrospec(controlList, callback);
    }
  ], function(err){
    callback(null);
  });
}

/**
* getIntrospec description
*
* @async
* @method getIntrospec
* @param {function} callback callback function
*/
ContrailSet.prototype.getIntrospec = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.controlSet.getIntrospec(callback);
    },
    function(callback){
      self.vRouterSet.getIntrospec(callback);
    }
  ], function(err){
    callback(null);
  });
};

/**
* checkServices description
*
* @async
* @method checkServices
* @param {function} callback callback function
*/
ContrailSet.prototype.checkServices = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.configSet.checkServices(callback);
    },
    function(callback){
      self.controlSet.checkServices(callback);
    },
    function(callback){
      self.vRouterSet.checkServices(callback);
    }
  ], function(err){
    callback(null);
  });
}

/**
* toString description
*
* @method toString
* @return {String} ContrailSet string description
*/
ContrailSet.prototype.toString = function(){
  return '###############"\n# ContrailSet #\n###############\n'+util.inspect(contrailSet, false, null, true);
}
/*
var main = function(){
  var contrailSet = new ContrailSet('localhost');

  async.waterfall([
    function(callback){
      var self = contrailSet;
      async.parallel([
        function(callback){
          console.log(util.inspect(this, null, 2));
          callback(null);
        },
        function(callback){
          self.discoveryClient.get(callback);
        }
      ], function(err){
        callback(null);
      });
    }
  ], function(err){
    console.log(""+contrailSet.discoveryClient);
  });
}

main();
*/
module.exports = ContrailSet;
