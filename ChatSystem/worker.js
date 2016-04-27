var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mongo = require('mongodb').MongoClient;


/*
-----------------------------------------------------------------------------
Below is an exact copy of a User Account in the Databse to use as a reference.
"_id" is something you can ignore, it's just an automatic primary key.
-----------------------------------------------------------------------------

{
    "_id": {
        "$oid": "570ade39e4b050965a586f62"
    },
    "fName": "Austin",
    "lName": "Marsella",
    "uName": "amarsella",
    "password": "apassword",
    "email": "amarsella5700@gmail.com",
    "adminCode": "0",
    "adminStatus": "false",
    "Departments": [
        "General",
        "Marketing",
        "Engineering",
        "Accounting",
        "HR",
        "RD"
    ]
}


*/


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

//Start of Admin Section

        //Admin Login Check
        socket.on('loginAdmin', function (user, respond) {
              console.log(user.uName + " Connected");
              mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers', function (err, db) {
                  var accountsCollection = db.collection('adminAccounts');
                  accountsCollection.find(user).count(function (err, count) {
                    console.log(count);
                    if (count == 0) {
                      respond('Login failed');
                    }
                    else {
                      respond();
                      console.log('Info is valid.');
                    }
                  });
              });
            });

      //Admin Throwing Back all the users to client
      socket.on('GetUserInfo', function () {
      /* For inside of here, connect to the mongodb, specify the collection
      you want to get data from, then set a variable to stream the results of a find()
      to get all of the users. While that stream is on (don't use an actual while loop)
      do a socket.emit of the userObject it is streaming. IMPORTANT 'data' is a
      reserved word for stream.on, you can pass out any placeholder name in the
      socket.emit though within the stream.on, just has to match the function
      name above it.
       */
      });


//End of Admin Section

        socket.on('disconnect', function () {
            console.log('User disconnected');
        });

        socket.on('chat', function (data) {
            scServer.global.publish(data.UserChannel, data.UserMessage);
			// mongo connect and find the collection
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
			mongo.connect('mongodb://prestigedbuser:dbpassword@ds021010.mlab.com:21010/prestigechat', function (err, db) {
                var chatCollection = db.collection('chatList');
				var stream = chatCollection.find(userCredentials).stream();
				stream.on('data', function(listOfFind) {
					socket.emit('chatPanelData', listOfFind);
				});
			});
		});

        socket.on('populateChatWindow', function(departmentName){
            // open a connection to the database
			mongo.connect('mongodb://prestigedbuser:dbpassword@ds021010.mlab.com:21010/prestigechat', function (err, db) {
                var chatCollection = db.collection(departmentName);

				var stream = chatCollection.find().stream();
				stream.on('data', function(messageObject) {
					socket.emit('chatReceivedData', messageObject.content);
				});
			});
		});
	});
};
