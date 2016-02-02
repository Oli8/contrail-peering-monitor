var async = require('async');
var unirest = require('unirest');
var contrailNode = require('./contrailNode');
var init = require('./init');
var control = require('./control');
var view = require('./view');
var util = require('util');

/*
run --> init.js --> view.js
                --> control.js
*/
async.waterfall([
  init._run,
  view.run
],function(err, res){
  console.log(util.inspect(contrailSet, false, null));
})
