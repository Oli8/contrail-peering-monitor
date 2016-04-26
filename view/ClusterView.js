var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');
var ContrailSetView = require('./ContrailSetView');
var ErrorsView = require('./ErrorsView');

var ClusterView = function(contrailSet){
  this.data = contrailSet;
  this.type = 'ClusterView';
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

var parseNodesinError = function(data){

}

ClusterView.prototype.append = function(screen){
  screen.append(this.view);
}

ClusterView.prototype.update = function(screen){
  var offset = (100/3);
  var width = 70;
  var errorView = new ErrorsView(this.data.vRouterSet, 99-width, width+1);

  if(this.data.error){
    this.view.content = this.data.error;
    return 0;
  }

  if(errorView.isErrors()){
    this.children.push(errorView);
  }
  else{
    width = 100;
  }

  this.children.push(new ContrailSetView(this.data, width, 0));

  for(i in this.children){
    this.view.append(this.children[i].view);
    this.children[i].update(screen);
  }
}

module.exports = ClusterView;
