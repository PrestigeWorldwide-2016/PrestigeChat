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

    socket.on('login', function (userinfoData) {
      console.log(userinfoData.Username + ' connected');

    });

    socket.on('disconnect', function () {
      clearInterval(interval);
    });
    
  });
};
