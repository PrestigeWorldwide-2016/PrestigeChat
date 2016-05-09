//Start Registration

$(document).ready(function() {

    $(document).on("click", ".registration__submit", function(e) {
        if ( ($('#FirstName').val() == "") || ($('#LastName').val() == "")
          || ($('#Email').val() == "") || ($('#Username').val() == "")
          || ($('#Password').val() == "") ) {
            console.log("user info not valid");
            window.prompt("Please enter Valid info");
            location.reload();
        } else {
            var socket = socketCluster.connect();
            var firstName = $('#FirstName').val();
            var lastName = $('#LastName').val();
            var email = $('#Email').val();
            var username = $('#Username').val();
            var userpass = $('#Password').val();
            
            var user = {
              fName: firstName,
              lName: lastName,
              email: email,
              uName: username,
              password: userpass
            };
            
            socket.emit('register', user, function (err) {
                if (err) {
                    console.log(err);
                    window.alert(err);
                    location.reload();
                } else {
                    window.prompt("Successfully Registered " + username + ".");
                    location.href = "/";
                }
            });
        }
    });
});

//End Registration