var async = require('async');
var ConfigSet = require('./ConfigSet');
var ControlSet = require('./ControlSet');
//var VRouterSet = require('./VRouterSet');
var ContrailNode = require('./ContrailNode');
var DiscoveryClient = require('./DiscoveryClient');
var util = require('util');

var ContrailSet = function(discovery, eventEmitter){
  this.eventEmitter = eventEmitter;
  this.discoveryClient = new DiscoveryClient(discovery);
  this.configSet = new ConfigSet();
  this.controlSet = new ControlSet();
  //this.vRouterSet = new VRouterSet();
  this.nodes={};
};

//@async
ContrailSet.prototype.update = function(callback){
  var self = this;
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
    }
  ], function(err){
    //console.log(util.inspect(self, { showHidden: true, depth: null, colors: false }));
    // console.log(JSON.stringify(self.configSet));
    // console.log(JSON.stringify(self.controlSet));
    // process.exit(0);
    //self.eventEmitter.emit('updated', self);
    callback(null);
  });
}

//@async
ContrailSet.prototype.getJSON = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.discoveryClient.get(callback);
    }
    //self.analyticsClient.get
  ], function(err){
    //console.log(""+self.discoveryClient);
    callback(null);
  });
}

//@async
ContrailSet.prototype.updateSet = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.configSet.update(self.discoveryClient.path['/clients.json'].data, self.discoveryClient.path['/services.json'].data, callback);
    },
    function(callback){
      self.controlSet.update(self.discoveryClient.path['/clients.json'].data, self.discoveryClient.path['/services.json'].data, callback);
    }
  ], function(err){
    callback(null);
  });
}

/*
function(callback){
contrailSet.vRouterSet.update(callback);
}*/

//@async
ContrailSet.prototype.getIntrospec = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.controlSet.getIntrospec(callback);
    }
  ], function(err){
    callback(null);
  });
};

//@async
ContrailSet.prototype.checkServices = function(callback){
  var self = this;
  async.parallel([
    function(callback){
      self.configSet.checkServices(callback);
    },
    function(callback){
      self.controlSet.checkServices(callback);
    }
    /*
    function(callback){
      self.vRouterSet.check();
    }*/
  ], function(err){
    callback(null);
  });
}

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
