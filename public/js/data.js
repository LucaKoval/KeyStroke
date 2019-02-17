function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            if (!(!data || data == '' || data == ' ')) {
                var keys = data.split(' ')
                keys.forEach(function(key) {
                    $("#current-notes").children("p").remove()
                    if (parseInt(key)) {
                        var note = ''
                        switch (parseInt(key)) {
                            case 1:
                                note = 'C'
                                break;
                            case 2:
                                note = 'C#'
                                break;
                            case 3:
                                note = 'D'
                                break;
                            case 4:
                                note = 'E♭'
                                break;
                            case 5:
                                note = 'E'
                                break;
                            case 6:
                                note = 'F'
                                break;
                            case 7:
                                note = 'F#'
                                break;
                            case 8:
                                note = 'G'
                                break;
                            case 9:
                                note = 'G#'
                                break;
                            case 10:
                                note = 'A'
                                break;
                            case 11:
                                note = 'B♭'
                                break;
                            case 12:
                                note = 'B'
                                break;
                        }
                        $("#current-notes").append("<p>"+note+"</p>")
                    }
                });
            }
        },
        error: function (err) {
          console.log('Error: ' + err)
        }
    });
}

setInterval(function() {
    requestData()
}, 100)
