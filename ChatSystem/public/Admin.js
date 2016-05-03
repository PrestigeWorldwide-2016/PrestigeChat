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

          //Tells server that client is ready to get users
          socket.emit('GetUserInfo');


          /* Waits for server to emit 'ServerUserInfo', data is a
          reserved variable name for each User object that is streamed to
          the client it is reserved at the server during stream.on */
          socket.on('ServerUserInfo', function (data) {
            /* Included in here is javascript HTML that will be sent to the
            webpage, it will be a mix of HTML in quotes and javascript object
            references for the content of what's inside the elemnents (div's,
             li's, etc.)  Don't forget you will have to use forEach functions
             for parts of the user object that contain arrays */

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
