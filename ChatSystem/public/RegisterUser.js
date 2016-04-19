//Start Registration=====================

$(document).ready(function() {

    $(document).on("click", ".registration__submit", function(e) {
<<<<<<< HEAD
=======
    var that = this;
>>>>>>> refs/remotes/origin/jc-dev

    var socket = socketCluster.connect();
    var fisrtName = $('#FirstName').val();
    var lastName = $('#LastName').val();
    var email = $('#Email').val();
    var username = $('#Username').val();
    var userpass = $('#Password').val();

    var user = {
      fName: fisrtName,
      lName: lastName,
      email: email,
      uName: username,
      password: userpass
    };

    socket.emit('register', user, function (err) {

      if (err) {
        console.log(err);
        window.prompt("We're Sorry! That Username or Email is already registered.")
        location.reload();
      }
      else {
        window.prompt("Successfully Registered You!!!");
        location.href = "/";
      }
    });
  });
});
