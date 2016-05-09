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
function validateEmail(email) {
    // http://stackoverflow.com/a/46181/11236
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

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
         mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers', function (err, db) {
             var UserCollection = db.collection('Accounts');
             var stream = UserCollection.find().stream();
                 stream.on('data', function(allUsersInfo) {
                        socket.emit('ServerUserInfo', allUsersInfo);
                 });
         });
      });


      socket.on('addDepartment', function (AddInfo) {
          console.log("This is the username to add: " + AddInfo.uNameEntered);
          console.log("This is the deparment to be added: " + AddInfo.DepartmentSel);
          mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers', function (err, db) {
              var accountsCollection = db.collection('Accounts');
              accountsCollection.update(
                 { uName: AddInfo.uNameEntered },
                 { $push: { Departments: AddInfo.DepartmentSel } }
              )
          });
      });

      socket.on('removeDepartment', function (RemoveInfo) {
          console.log("This is the username to add: " + RemoveInfo.uNameEntered);
          console.log("This is the deparment to be added: " + RemoveInfo.DepartmentSel);
          mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers', function (err, db) {
              var accountsCollection = db.collection('Accounts');
              accountsCollection.update(
                 { uName: RemoveInfo.uNameEntered },
                 { $pull: { Departments: RemoveInfo.DepartmentSel } }
              )
          });
      });

//End of Admin Section

        socket.on('disconnect', function () {
            console.log('User disconnected');
        });


        socket.on('getChannelHistory', function(departmentArray){
          console.log("This is the second index of department Array: " + departmentArray[1]);
            // open a connection to the database
            mongo.connect('mongodb://prestigedbuser:dbpassword@ds021010.mlab.com:21010/prestigechat', function (err, db) {
              for(k = 0; k < departmentArray.length; k++) {
                var chatCollection = db.collection(departmentArray[k]);
                var stream = chatCollection.find().limit(1).sort({$natural:-1}).stream();
                stream.on('data', function(DeptObj) {
                  socket.emit('gottenChannelHistory', DeptObj);
                });
              }
            });
          });


        socket.on('chat', function (data) {
            scServer.global.publish(data.UserChannel, data.UserMessage);
      			// mongo connect and find the collection
            var thisChannel = data.UserChannel;
            var thisMessage = data.UserMessage;
            console.log(thisMessage + ' ----- was posted inside the channel: ' + thisChannel);

            //new obj that holds the most recent message
                        var rcvdMsg = {
                          "content" : thisMessage
                        }
            //
                        mongo.connect('mongodb://prestigedbuser:dbpassword@ds021010.mlab.com:21010/prestigechat', function (err, db) {
                                  var chatCollection = db.collection(thisChannel);
                                  chatCollection.insertOne(rcvdMsg);
                                })
        });

        socket.on('register', function (user, respond) {
            var response = "";
            var invalidInput = false;

            if(user.fName.trim().length < 1) {
                response += "Invalid username, please enter username at least 6 characters in length";
                invalidInput = true;
            }
            if(user.lName.trim().length < 1) {
                response += "\nInvalid last name.";
                invalidInput = true;
            }
            if(!validateEmail(user.email)) {
                response += "\nInvalid email address.";
                invalidInput = true;
            }
            if(user.uName.trim().length < 6) {
                response += "\nInvalid username, please enter username at least 6 characters in length";
                invalidInput = true;
            }
            if(user.password.length < 8) {
                response += "\nPassword must be longer than 8 characters.";
                invalidInput = true;
            }

            if(invalidInput == true) {
                respond(response);
            } else {
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
            }
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
    //---------------------------------------------//

    socket.on('getDepartmentArray', function(username){
      var userInfo = {
        "uName": username
      };
      mongo.connect('mongodb://prestigedbuser:dbpassword@ds019940.mlab.com:19940/prestigeusers',
          function (err, db) {
              var accountsCollection = db.collection('Accounts');
              var stream = accountsCollection.find(userInfo).stream();
              stream.on('data', function(userDoc) {
                socket.emit('receivedDepartmentArray', userDoc.Departments);
              });
            });
          });
        });

    //--------------------------------------------//
	};
// };
