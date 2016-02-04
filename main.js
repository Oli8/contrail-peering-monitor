var async = require('async');
var program = require('commander');
var util = require('util');
var contrailNode = require('./contrailNode');
var init = require('./init');
var control = require('./control');
var view = require('./view');

program
.version('0.0.1')
.usage('-a <hostname> [options]')
.option('-a, --analytics <hostname>', 'Analytics address')
.option('-t, --time-to-refresh <time>', 'Interval to refresh data (in ms)', parseInt)
.parse(process.argv);

async.waterfall([
  async.apply(init.initConfig, program),
  init.run,
  // function(callback){
  //   setInterval(init._updateContrailSet,3000,callback);
  // },
  view.run
],function(err, res){
  console.log(util.inspect(contrailSet, false, null));
})
