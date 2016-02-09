// Process
var Service = function(name){
	this.name = name;
	this.status = "FAILED";
}

//status:bool
var setStatus = function(status){
	this.status = status;
};

module.exports = Service;
