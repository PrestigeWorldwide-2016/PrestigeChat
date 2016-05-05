var departmentArray = [""];
$(document).ready(function() {

    var submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $login = $(".login-card"),
      $app = $(".app");

    $app.hide();

	$(document).on("click", ".login__submit", function(e) {
        var that = this; // what's this?

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
                //location.reload();
            }
            else {
                setTimeout(function() {
                    setTimeout(function() {
                        $app.show();
              //        $app.css("top");
              //        $app.addClass("active");
                    }, submitPhase2 - 70);
                    setTimeout(function() {
                        $login.hide();
              //        $login.addClass("inactive");
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


          var channelName = "BigGroup";
          var chatChannel = socket.subscribe(channelName);
          chatChannel.on('subscribeFail', function(err) {
          console.log('Failed to subscribe to ' + channelName + ' channel due to error: ' + err);
          });

            console.log("This is the connected channelName: " + channelName);

            $('#MessageForm').unbind('submit').bind('submit',function() {
                if($('#message').val() != '') {
                    socket.emit('chat', {
                        UserMessage: username + ":  " + $('#message').val(),
                        UserChannel: channelName
                    });
                }
                $('#message').val('');
                return false;
            });

			var userCred = { uName: username };
            socket.emit('getChatMessages', userCred);
			socket.on('chatPanelData', function(data) {
                $('#channels-list').append(
                  '<li class="DepartmentName id=' + data.channelName + '><span style="font-weight: bold">'
                  + data.displayName
                  + '</span> <br> <span style="color:blue">'
                  + data.chatHistory
                  + '</span> </li>');
			        });

            chatChannel.watch(function (data) {
                 $('#messages-list').append('<li>' + data + '</li>');
                 // update the channel panel
                 var channelName = '#channels-list#' + data.UserChannel;
                 $(channelName).text(data);
                 // update the channel panel
                 $('div#messages-div').scrollTop(
                     $('div#messages-div')[0].scrollHeight);
            });

    $(document).on("click", ".DepartmentName", function(e) {
        var openDepartmentNamed = e.target.id();
        
        chatChannel = socket.subscribe(openDepartmentNamed);
        
        socket.emit('populateChatWindow', openDepartmentNamed);

        socket.on('chatReceivedData', function(data) {
                $('#messages-list').append(
                  '<li>' + data + '</li>'
                );
                $('div#messages-div').scrollTop(
                    $('div#messages-div')[0].scrollHeight);
              });
            });

        ///---------------------------------------------------------------//
        socket.emit('getDepartmentArray', username);

        socket.on('receivedDepartmentArray', function(receivedDepartmentArray){
          departmentArray = receivedDepartmentArray;
          console.log(departmentArray);
          console.log(receivedDepartmentArray);
        });

        //--------------------------------------------------------------//
        }
    });
});
