﻿var fs = require('fs');
var server = require('http').createServer(function(req, response){
  fs.readFile(__dirname+'/multiroomchat.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'}); 
    response.write(data);  
    response.end();
  });
});
server.listen(8080);


var nowjs = require("now");
var everyone = nowjs.initialize(server);


nowjs.on('connect', function(){
  this.now.room = "room 1";
  nowjs.getGroup(this.now.room).addUser(this.user.clientId);
  console.log("Joined: " + this.now.name);
});


nowjs.on('disconnect', function(){
  console.log("Left: " + this.now.name);
});


everyone.now.remove = function (name){
  
  console.log("removing group");
  nowjs.removeGroup(name);
};


everyone.now.changeRoom = function(newRoom){
  nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
  nowjs.getGroup(newRoom).addUser(this.user.clientId);
  this.now.room = newRoom;
  this.now.receiveMessage("SERVER", "You're now in " + this.now.room);
}



everyone.now.distributeMessage = function(message){
  console.log(this.now.name + "says" + message);
  nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, message);
};

//directly called the removeGroup
//nowjs.removeGroup('room 2');
