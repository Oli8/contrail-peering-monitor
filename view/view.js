var blessed = require('blessed');
var contrib = require('blessed-contrib');
var async = require('async');
var utils = require('../src/utils');
var ContrailSetView = require('./ContrailSetView');

var View = function(eventEmitter){
  this.eventEmitter = eventEmitter;
  this.type = 'View';
  this.contrailView = null;
  //this.eventEmitter.on('updated', this.update);
}

var updateView = function(self, data){
  self.contrailView = new ContrailSetView(data);
  self.contrailView.update(screen);
  screen.append(self.contrailView.view);
}

var cleanView = function(nodeView){
  nodeView.view.destroy();
}

var renderView = function(){
  screen.render();
}

View.prototype.update = function(contrailSet){
  if(this.contrailView){
    cleanView(this.contrailView);
  }
  updateView(this, contrailSet);
  renderView();
}

var screen = blessed.screen({
  smartCSR: true,
  log: 'log/view.log'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
   return process.exit(0);
});

module.exports = View;
