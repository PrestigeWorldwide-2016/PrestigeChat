var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mongo = require('mongodb').MongoClient;

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
        socket.on('login', function (user, respond) {
            console.log(user.uName + " Connected");
            mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers', function (err, db) {
                var accountsCollection = db.collection('Accounts');
                accountsCollection.find(user).count(function (err, count) {
                    console.log(count);
                    if (count == 0) {
                        respond('Login failed');
                    } else {
                        respond();
                        console.log('Info is valid.');
                    }
                });
            });
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

        socket.on('register', function (user, respond) {
            console.log(user.uName + " Registering...");
            mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers',
                function (err, db) {
                    var accountsCollection = db.collection('Accounts');
                        accountsCollection.find({ 
                            $or: [{ "uName": user.uName }, 
                                  { "email": user.email }] 
                        }).count(function (err, count) {
                            console.log(count);
                            if (count == 0) {
                                accountsCollection.insertOne(user);
                                respond();
                            } else {
                                respond("User Already Exists!");
                                console.log('User Already Exists!');
                            }
                        });
            });
        });

        socket.on('getChatMessages', function(userCredentials){
            // open a connection to the database
            console.log(user.uName + " Connected");
            mongo.connect('mongodb://prestigedbuser:dbpassword@ds021010.mlab.com:21010/prestigechat', function (err, db) {
                var chatCollection = db.collection('chatList');
				var stream = chatCollection.find(userCredentials).stream();
				stream.on('data', function(listOfFind) {
					// wrap listOfFind in an array
					var arrayOfCollections = [];
					while(chatCollection.hasNext()) {
					   arrayOfCollections.push(chatCollection.next());
					}
					socket.emit('chatPanelData', arrayOfCollections);
				});
			});
		});
};