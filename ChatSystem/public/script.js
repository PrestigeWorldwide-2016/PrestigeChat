
$(document).ready(function() {


var   submitPhase1 = 1100,
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
    var userinfo = {
      Username: username,
      UserPass: userpass
    };

    socket.emit('login', userinfo, function (err) {

      if (err) {
        console.log("That was incorrect Account info");
      //  location.reload();
      }
      else {

    setTimeout(function() {
      setTimeout(function() {
        $app.show();
        $app.css("top");
        $app.addClass("active");
      }, submitPhase2 - 70);
      setTimeout(function() {
        $login.hide();
        $login.addClass("inactive");
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

      }

  });

});
