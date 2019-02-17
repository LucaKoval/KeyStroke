// $.ajax
// ({
//     type: "POST",
//     url: "http://localhost:8000/index",
//     dataType: "json",
//     cache : false,
//     success: function (data) {
//         $('#content').text(data.message);
//     },
//     error: function (err) {
//       console.log(err);
//     }
// });

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

// setTimeout(requestData, 500)

setInterval(function() {
    // window.location.reload(true)
    // location.reload()
    // $(".container > p").load('index')
    requestData()
    console.log('OONF')
}, 500)
