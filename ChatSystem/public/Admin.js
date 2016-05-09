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
      }
      else {
    setTimeout(function() {
      setTimeout(function() {
        $app.show();
      }, submitPhase2 - 70);
      setTimeout(function() {
        $adminlogin.hide();
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
              '</ul> Departments Apart of: <ul class="departmentList">' + departmentString + '</ul></div>'
            );

            $(document).on("click", ".addDepartment", function(event) {
              valueOfAddDept = $('#' + data.uName).val();
              console.log("This is the value of the text box " + valueOfAddDept);
                });

          });


$(document).on("click", ".AddDept", function(event) {
  
    var e = document.getElementById("SelectedDept");
    var selection = e.options[e.selectedIndex].value;
    console.log("The value of the clicked element is " + selection);
    EnteredName = $('#uNameDept').val();
    console.log("The entered username is: " + EnteredName);
    var AddInfo = {
      "DepartmentSel": selection,
      "uNameEntered": EnteredName
    };

    socket.emit("addDepartment", AddInfo);

});


$(document).on("click", ".RemoveDept", function(event) {

    var e = document.getElementById("SelectedDept");
    var selection = e.options[e.selectedIndex].value;
    console.log("The value of the clicked element is " + selection);
    EnteredName = $('#uNameDept').val();
    console.log("The entered username is: " + EnteredName);
    var RemoveInfo = {
      "DepartmentSel": selection,
      "uNameEntered": EnteredName
    };

    socket.emit("removeDepartment", RemoveInfo);

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
