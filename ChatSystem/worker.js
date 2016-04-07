var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);

  var app = require('express')();

  var httpServer = worker.httpServer;
  var scServer = worker.scServer;

  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('request', app);

  var count = 0;

  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {

    socket.on('login', function (userinfoData, respond) {
      console.log(userinfoData.Username + ' connected');
      respond();
    });

    socket.on('disconnect', function () {
    console.log('User disconnected');
    });


    socket.on('chat', function (data) {
      scServer.global.publish(data.UserChannel, data.UserMessage);
      var thisChannel = data.UserChannel;
      var thisMessage = data.UserMessage;
      console.log(thisMessage + ' ----- was posted inside the channel: ' + thisChannel);
    });


  });
};
