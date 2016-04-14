//Start Registration=====================

$(document).ready(function() {

    $(document).on("click", ".register__submit", function(e) {
    var that = this;


    var socket = socketCluster.connect();
    var fisrtName = $('#First_Name').val();
    var lastName = $('#Last_name').val();
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
        //location.reload();
      }
      else {
        //Redirect to login page if it succesful in saving to DB
      }
    });
  });
});