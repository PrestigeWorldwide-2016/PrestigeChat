$(document).ready(function() {

    var submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $login = $(".login-card"),
      $app = $(".app");

    $app.hide();

	$(document).on("click", ".login__submit", function(e) {
        var that = this;

        var socket = socketCluster.connect();
        var username = $('#Username').val();
        var userpass = $('#Password').val();
        var user = {
          uName: username,
          password: userpass
        };

        socket.emit('login', user, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                setTimeout(function() {
                    setTimeout(function() {
                        $app.show();
                    }, submitPhase2 - 70);
                    setTimeout(function() {
                        $login.hide();
                    }, submitPhase2);
                }, submitPhase1);

                ConnectUser();
            }
        });


        function ConnectUser() {
            socket.on('error', function (err) {
                throw 'Socket error - ' + err;
            });

        socket.on('connect', function () {
          console.log(username + ' Connected to server');
          });


    $(document).on("click", ".DepartmentName", function(e) {

      $("#messages-list").empty();

        var DeptStringName = [];
        DeptName = $(e.target).text();
        DeptStringName = DeptName.split(" ");
        DeptClickedName = DeptStringName[0];

        console.log("This is clicked department name: " + DeptClickedName);

        socket.unsubscribe();
        chatChannel = socket.subscribe(DeptClickedName);

        chatChannel.on('subscribeFail', function(err) {
        console.log('Failed to subscribe to ' + DeptClickedName + ' channel due to error: ' + err);
        });

          console.log("This is the connected channelName: " + DeptClickedName);

          $('#MessageForm').unbind('submit').bind('submit',function() {
              if($('#message').val() != '') {
                  socket.emit('chat', {
                      UserMessage: username + ":  " + $('#message').val(),
                      UserChannel: DeptClickedName
                  });
              }
              $('#message').val('');
              return false;
          });

          chatChannel.watch(function (data) {
               $('#messages-list').append('<li>' + data + '</li>');
               var channelName = '#channels-list#' + data.UserChannel;
               $(channelName).text(data);
               $('div#messages-div').scrollTop(
                   $('div#messages-div')[0].scrollHeight);
          });

        socket.emit('populateChatWindow', DeptClickedName);

        socket.off('chatReceivedData');

        socket.on('chatReceivedData', function(data) {
                $('#messages-list').append(
                  '<li>' + data + '</li>'
                );
                $('div#messages-div').scrollTop(
                    $('div#messages-div')[0].scrollHeight);
              });
    });

        //---------------------------------------------------------------//
        socket.emit('getDepartmentArray', username);
        socket.on('receivedDepartmentArray', function(receivedDepartmentArray){
        console.log("Received Array: " + receivedDepartmentArray);
        socket.emit('getChannelHistory', receivedDepartmentArray);
        });

        socket.on('gottenChannelHistory', function(data){
          $('#channels-list').append(
            '<li class="DepartmentName id=' + data.UserChannel + '><span style="font-weight: bold">'
            + data.UserChannel + " "
            + '</span> <br> <span style="color:blue">'
            + data.UserMessage
            + '</span> </li>');
        });
        //--------------------------------------------------------------//
        }
    });
});
