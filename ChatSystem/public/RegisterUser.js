//Start Registration=====================

$(document).ready(function() {

    $(document).on("click", ".registration__submit", function(e) {

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

    if ((fisrtName == null) || (lastName == null) 
         || (email == null) || (username == null) 
         || (userpass == null)) {
      console.log("User did not enter Valid Credetials.");
      window.prompt("Please enter Valid Credetials.");
      location.reload();
    }

    else {

    socket.emit('register', user, function (err) {

      if (err) {
        console.log(err);
        window.prompt("We're Sorry! That Username or Email is already registered.");
        location.reload();
      }
      else {
        window.prompt("Successfully Registered You!!!");
        location.href = "/";
      }
    });
   }
  });
});
