var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');
var ConfigSetView = require('./ConfigSetView');
var ControlSetView = require('./ControlSetView');
var VRouterSetView = require('./VRouterSetView');

var ContrailSetView = function(contrailSet){
  this.data = contrailSet;
  this.type = 'ContrailSetView';
  this.view = initView();
  this.children = [];
}

var initView = function(){
  var box = blessed.box({
    width: '100%',
    height: '100%',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      }
    }
  });
  return box;
}

var parseData = function(data){

}

ContrailSetView.prototype.append = function(screen){
  screen.append(this.view);
}

ContrailSetView.prototype.update = function(screen){
  var offset = (100/3);

  this.children.push(new ConfigSetView(this.data.configSet, offset, 0*offset));
  this.children.push(new ControlSetView(this.data.controlSet, offset, 1*offset));
  this.children.push(new VRouterSetView(this.data.controlSet, this.data.vRouterSet, offset, 2*offset));

  for(i in this.children){
    this.view.append(this.children[i].view);
    this.children[i].update(screen);
  }
}

module.exports = ContrailSetView;
