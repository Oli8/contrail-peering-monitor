var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');

var ControlNodeView = function(data, width, offset){
  this.data = data;
  this.type = 'ControlNodeView';
  this.view = initView(data.name, width, offset);
}

var initView = function(name, width, offset){
  var table = contrib.table({
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: name,
    left: offset+'%',
    width: width+'%',
    height: '90%',
    border: {type: "line", fg: "cyan"},
    columnSpacing: 5, //in chars
    columnWidth: [20, 13] /*in chars*/
  });
  table.rows.style.selected.bg = undefined;
  return table;
}

var parseData = function(data){
  var result = {
    headers: ['Service', 'Status'],
    data:[]
  };
  for(i in data.services){
    var service = data.services[i];
    result.data.push([service['name'], service['status']]);
  }
  if(data.ifmapPeer){
    for(i in data.ifmapPeer.peer){
      result.data.push(['IFMAP '+data.ifmapPeer.peer[i].status, data.ifmapPeer.peer[i].host]);
    }
  }
  return result;
}

ControlNodeView.prototype.append = function(screen){
  screen.append(this.view);
}

ControlNodeView.prototype.update = function(screen){
  var dataSet = parseData(this.data);
  this.view.setData(dataSet);
}

var main = function(screen){
  utils.stdin(function(err, data){
    //console.log(data[0]);
    var result = parseData(data);
    console.log('################\n# Parse Object #\n################\n'+require('util').inspect(result, { depth: null }));
  });
}

if (require.main === module) {
  main();
}

module.exports = ControlNodeView;
