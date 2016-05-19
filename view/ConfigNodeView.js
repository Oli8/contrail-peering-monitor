var blessed = require('blessed');
var contrib = require('blessed-contrib');
var util = require('util');
var utils = require('../src/utils');

var ConfigNodeView = function(data, width, offset){
  this.data = data;
  this.type = 'ConfigNodeView';
  this.view = initView(data.name, width, offset);
}

var initView = function(name, width, offset){
  var table = contrib.table({
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    label: name,
    left: offset+'%',
    width: width+'%',
    height: '90%',
    border: {type: "line", fg: "cyan"},
    columnSpacing: 5, //in chars
    columnWidth: [20, 25] /*in chars*/
  });
//  table.rows.style.selected.bg = undefined;
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
  return result;
}

ConfigNodeView.prototype.append = function(screen){
  screen.append(this.view);
}

ConfigNodeView.prototype.update = function(screen){
  var dataSet = parseData(this.data);
  dataSet = utils.setColorTag(dataSet);
  this.view.setData(dataSet);
}

var main = function(screen){
  utils.stdin(function(err, data){
    //console.log(data[0]);
    var result = parseData(data);
    result = utils.setColorTag(result);
    console.log('################\n# Parse Object #\n################\n'+require('util').inspect(result, { depth: null }));
  });
}

if (require.main === module) {
  main();
}

module.exports = ConfigNodeView;
