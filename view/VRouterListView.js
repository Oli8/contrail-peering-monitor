var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');

var VRouterListView = function(controlName, vRouterData, width, offset){
  this.parent = controlName;
  this.data = vRouterData;
  this.type = 'VRouterListView';
  this.view = initView(width, offset);
}

var initView = function(width, offset){
  var table = contrib.table({
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    label: 'vRouters',
    left: offset+'%',
    width: width+'%',
    height: '90%',
    border: {type: "line", fg: "cyan"},
    columnSpacing: 5, //in chars
    columnWidth: [20, 12] /*in chars*/
  });
  return table;
}

var parseData = function(controlNode, data){
  var result = {
    headers: ['Nodes', 'Status'],
    data:[]
  };
  for(i in data.nodes){
    var node = data.nodes[i];
    if(node.xmppPeer){
      if(node.xmppPeer.active == controlNode){
        result.data.push([node['name'], node['services'][0]['status']]);
      }
    }
  }
  return result;
}

VRouterListView.prototype.append = function(screen){
  screen.append(this.view);
}

VRouterListView.prototype.update = function(screen){
  var dataSet = parseData(this.parent, this.data);
  dataSet = utils.setColorTag(dataSet);
  this.view.setData(dataSet);
}

var main = function(screen){
  var controlNode = 'd-octclc-0000';
  utils.stdin(function(err, data){
    var result = parseData(controlNode, data);
    console.log('################\n# Parse Object #\n################\n'+require('util').inspect(result, { depth: null }));
  });
}

if (require.main === module) {
  main();
}

module.exports = VRouterListView;
