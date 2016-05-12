var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');
var ConfigNodeView = require('./ConfigNodeView');

var ConfigSetView = function(data, height, offset){
  this.data = data;
  this.type = 'ConfigSetView';
  this.view = initView(height, offset);
  this.children = [];
}

var initView = function(height, offset){
  var box = blessed.box({
    top: offset+'%',
    width: '99%',
    height: height+'%',
    /*border: {
      type: 'line'
    },*/
    style: {
      fg: 'white',
      //bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      }
    }
  });
  return box;
}

var parseData = function(data){

}

ConfigSetView.prototype.append = function(screen){
  screen.append(this.view);
}

ConfigSetView.prototype.update = function(screen){
  var nodes = this.data.nodes;
  var offset = (100/nodes.length);

  for(i in nodes){
    this.children.push(new ConfigNodeView(nodes[i], offset, i*offset));
    //screen.log(nodes[i]);
    this.view.append(this.children[i].view);
    this.children[i].update(screen);
  }
}

module.exports = ConfigSetView;
