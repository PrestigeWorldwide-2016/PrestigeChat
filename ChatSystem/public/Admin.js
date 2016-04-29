$(document).ready(function() {

var   submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $adminlogin = $(".adminLogin-card"),
      $app = $(".app");
      $app.hide();

    $(document).on("click", ".adminLogin__submit", function(e) {

    var socket = socketCluster.connect();
    var username = $('#Username').val();
    var userpass = $('#Password').val();
    var user = {
      uName: username,
      uPassword: userpass
    };

    socket.emit('loginAdmin', user, function (err) {

      if (err) {
        console.log(err);
        //location.reload();
      }
      else {
    setTimeout(function() {
      setTimeout(function() {
        $app.show();
//        $app.css("top");
  //      $app.addClass("active");
      }, submitPhase2 - 70);
      setTimeout(function() {
        $adminlogin.hide();
  //      $login.addClass("inactive");
        }, submitPhase2);

      }, submitPhase1);
      ConnectAdmin();
    }
  });

function ConnectAdmin() {


        socket.on('error', function (err) {
          throw 'Socket error - ' + err;
          });

        socket.on('connect', function () {
          console.log(username + ' Admin Connected to server');
          });

          //Tells server that client is ready to get users
          socket.emit('GetUserInfo');


          socket.on('ServerUserInfo', function (data) {
            console.log("Getting Server User Info!");
            console.log(data);


            var departmentString = "";
            if (data.Departments.length) {
            for (k=0; k < data.Departments.length; k++) {
              departmentString += '<li>' + data.Departments[k] + '</li>' ;
            }
            }
            else {departmentString = '<li> No Departments for this User </li>'}


            $('div.app').append(
              '<div class="userBlock"><ul class="userList">' +
              '<li> First Name: <strong>' + data.fName + '</strong></li>' +
              '<li> Last Name: <strong>' + data.lName + '</strong></li>' +
              '<li> Username: <strong>' + data.uName + '</strong></li>' +
              '<li> Email: <strong>' + data.email + '</strong></li>' +
            //  '<li>' + data.Departments + '</li>' +

              '</ul> Departments Apart of: <ul class="departmentList">' + departmentString + '</ul>' +
              '<input class= "depToChange"></input>' +
              '<button type="button" class="addDepartment">Add New</button>' +
              '<button type="button" class="removeDepartment">Remove</button></div>'
            );

          });


          //Code from scriptJS left in here to view as an example
          /*
          var channelName = "BigGroup";
          var chatChannel = socket.subscribe(channelName);
          chatChannel.on('subscribeFail', function(err) {
          console.log('Failed to subscribe to ' + channelName + ' channel due to error: ' + err);
            });
          console.log("This is the connected channelName: " + channelName);


          $('#MessageForm').unbind('submit').bind('submit',function() {
           if($('#message').val() != '') {
             socket.emit('chat',{ UserMessage: username + ":  " + $('#message').val(), UserChannel: channelName});
               }
             $('#message').val('');
             return false;
           });

           chatChannel.watch(function (data) {
             $('#messages-list').append($('<li>').text(data));
             $('div#messages-div').scrollTop($('div#messages-div')[0].scrollHeight)
             });
             */

    }

  });

});
