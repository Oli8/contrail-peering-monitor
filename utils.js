var portscanner = require('portscanner');

var portScan = function(port, hostname, callback){
  portscanner.checkPortStatus(port, hostname, function(error, status) {
    // Status is 'open' if currently in use or 'closed' if available
    console.log(status);
    callback(status);
  });
}

var clientTypeFilter = function(elem){
  if(elem[this.field] in this.filter){
    return true;
  }
  return false;
}

/**
Return an array with unique element
*/
var uniq = function(tab){
  var res = tab.filter(function(elem, index) {
    return tab.indexOf(elem) == index;
  });
  return res;
}


/////////////////////////////////////////////

var extractClientType = function(tab, typeTab){
  var res;
  for(i in tab){
    if(tab[i][1] in typeTab){
      res.push(tab[i][0]);
    }
  }
}

var splitClientNameFromService = function(tab){
  var res = [];
  for(i in tab){
    res.push(tab[i].split(':'));
  }
  return res;
}

var extractField = function(tab, field){
  var res = [];
  for(obj in tab){
    res.push(obj[field]);
  }
  return res;
}
exports.portScan = portScan;
exports.uniq = uniq;
exports.extractField = extractField;
