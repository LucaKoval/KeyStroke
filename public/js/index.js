function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            console.log('data: ' + data)
            $('#value').html("It's " + data)
        },
        error: function (err) {
          console.log('Error: ' + err);
        }
    });
}

setInterval(function() {
    requestData()
}, 500)
