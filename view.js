var blessed = require('blessed');
var contrib = require('blessed-contrib');
var contrailNode = require('./contrailNode');
var control = require('./control');

exports.run = function(callback){
  ///////////////////////
  // UI configuration //
  //////////////////////

  var screen = blessed.screen({
    smartCSR: true,
    log: __dirname + '/view.log'
  });
  var grid = new contrib.grid({rows: 14, cols: 14, screen: screen});

  //grid.set(row, col, rowSpan, colSpan, obj, opts)
  var nodeTable = grid.set(0, 0, 6, 6, contrib.table, {
    keys: true,
    fg:'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: 'Node',
    width: '30%',
    height: '30%',
    style: {
      border: {type: "line", fg: "cyan"},
      focus: {
        border: {
          fg: 'white'
        }
      }
    },
    columnSpacing: 10,
    columnWidth: [16, 12]
  });

  var servicesTable = grid.set(0, 6, 6, 6, contrib.table, {
    keys: true,
    fg:'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: 'Active Services',
    width: '30%',
    height: '30%',

    style: {
      border: {type: "line", fg: "cyan"},
      focus: {
        border: {
          fg: 'white'
        }
      }
    },
    columnSpacing: 10,
    columnWidth: [16, 12]
  });

  nodeTable.focus();

  //////////////
  // Set Data //
  //////////////

  //update the Nodes view
  var updateNodeView = function(){
    console.log('UPDATE!');
    var nodeList = [];

    for(i in contrailSet.nodes){
      nodeList.push([contrailSet.nodes[i].name]);
    }

    nodeTable.setData({
      headers: ['Node Name'],
      data: nodeList,
    });
  };

  // update Services Status View by passing config names
  var updateServiceView = function(nodeName){
    var servicesList = [];

    for(serv in contrailSet.nodes[nodeName].services){
      serv = contrailSet.nodes[nodeName].services[serv];
      var servRow = [serv.name, serv.status];
      servicesList.push(servRow);
    }

    servicesTable.setData({
      headers: ['Services Status'],
      data: servicesList
    });
    screen.log('helo');
    screen.render();
  }

  // simulate services update
  var simuleUpdateServiceView = function(){
    var servicesList = [['IF-MAP'],
    ['API'],
    ['SVC']];

    for(i=0; i<servicesList.length; i++){
      if(Math.round(Math.random())== 1){
        servicesList[i].push("OK");
      }
      else{
        servicesList[i].push("NOK");
      }
    }

    servicesTable.setData({
      headers: ['Node Name'],
      data: servicesList,
    });

    screen.render();
  }


  //////////////////////
  // Keyboard handler //
  //////////////////////

  screen.key(['escape', 'q', 'C-c', 'C-d'], function(ch, key) {
    //callback(null);
    return process.exit(0);
  });

  screen.key(['C-right', 'tab', 'n'], function(ch, key) {
    screen.focusNext();
    screen.render();
  });

  screen.key(['C-left'], function(ch, key) {
    screen.focusPrevious();
  });

  updateNodeView();
  screen.render();
  //setInterval(updateNodeView, 4000);
  nodeTable.on("element select", function(){
    updateServiceView(nodeTable.rows.value);
    screen.log(nodeTable.rows.value);
  });

  // contrailNode.updateEvent.on('updateEvent',function(){
  //   updateNodeView();
  //   screen.render();
  // });
}

//this.run(null);
//screen.focusPush(nodeTable);
//screen.focusPush(servicesTable);
// nodeTable.on('focus', function(el) {
//   el.parent.border.fg = 'red';
//   screen.render();
// });
