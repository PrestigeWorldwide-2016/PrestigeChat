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
      password: userpass
    };

    socket.emit('adminLogin', user, function (err) {

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
        $login.hide();
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