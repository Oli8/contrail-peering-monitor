var portscanner = require('portscanner');
var unirest = require('unirest');

var requestJSON = function(href, callback){
  unirest.get(href)
  .header('application/json')
  .end(function(response){
    objJSON = response.body;
    callback(null, objJSON);
  });
};

var portScan = function(port, hostname, callback){
  portscanner.checkPortStatus(port, hostname, function(error, status) {
    // Status is 'open' if currently in use or 'closed' if available
    callback(null, status);
  });
}

var clientTypeFilter = function(elem){
  if(this.filter.indexOf(elem[this.field])!=-1){
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


var stdin = function(fn){
  var data = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) data += chunk;
  });

  process.stdin.on('end', function() {
    fn(null, JSON.parse(data));
  });
}

/////////////////////////////////////////////

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
exports.requestJSON = requestJSON;
exports.uniq = uniq;
exports.extractField = extractField;
exports.clientTypeFilter = clientTypeFilter;
exports.stdin = stdin;
