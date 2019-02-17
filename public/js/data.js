function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            if (!(!data.keyPressed || data.keyPressed == '' || data.keyPressed == ' ')) {
                var keys = data.keyPressed.split(' ')
                keys.forEach(function(key) {
                    // $("#current-notes").children("p").remove()
                    if (parseInt(key)) {
                        var note = ''
                        switch (parseInt(key)) {
                            case 1:
                                note = 'E♭'
                                break;
                            case 2:
                                note = 'C#'
                                break;
                            case 3:
                                note = 'B♭'
                                break;
                            case 4:
                                note = 'G#'
                                break;
                            case 5:
                                note = 'F#'
                                break;
                            case 6:
                                note = 'F'
                                break;
                            case 7:
                                note = 'G'
                                break;
                            case 8:
                                note = 'A'
                                break;
                            case 9:
                                note = 'B'
                                break;
                            case 10:
                                note = 'C'
                                break;
                            case 11:
                                note = 'D'
                                break;
                            case 12:
                                note = 'E'
                                break;
                        }
                        $("#current-notes").children("p").remove()
                        $("#current-notes").append("<p>"+note+"</p>")
                        console.log(note);
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
