var dFirst = new Date();
var dSecond = null;
var tempo = 0;
var pressedPrev = false;
var pressedCurr = false;

function requestData() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/update",
        success: function (data) {
            if (!(!data.keyPressed || data.keyPressed == '' || data.keyPressed == ' ')) {
                pressedPrev = pressedCurr
                pressedCurr = true
                // console.log('change ',pressedPrev == pressedCurr)
                var keys = data.keyPressed.trim().split(' ')
                var note = ''
                console.log(keys)
                keys.forEach(function(key) {
                    if (parseInt(key)) {
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
                    }
                    $("#current-notes").children("p").remove()
                    $("#current-notes").append("<p>Note being played: "+note+"</p>")
                });
                // console.log('change? ',  pressedPrev == pressedCurr)
                console.log(pressedPrev != pressedCurr)
                if (pressedPrev != pressedCurr) {
                    // console.log('FUCKASLD;JDFKLS')
                    dSecond = new Date();
                    // console.log((dSecond - dFirst))
                    var secondsPerBeat = (dSecond - dFirst)/1000;
                    var beatsPerSecond = 1/secondsPerBeat;
                    tempo = beatsPerSecond * 60;
                    dFirst = dSecond;
                    dSecond = null
                    // console.log(tempo)
                    $("#tempo > p").html('Tempo: ' + Math.floor(tempo) + "bpm")
                }
            } else {
                pressedPrev = pressedCurr
                pressedCurr = false
                var note = 'No note is being played.'
                $("#current-notes").children("p").remove()
                $("#current-notes").append("<p>" + note + "</p>")
            }
            // console.log(pressedPrev, pressedCurr)
            // console.log('aaaa: ', pressedPrev == pressedCurr)
            var dNow = new Date();
            if ((dNow - dFirst)/1000 >= 3) $("#tempo > p").html('Tempo: Please play to generate a tempo.')

            if (!(!data.keyDuration || data.keyDuration == '' || data.keyDuration == ' ')) {
                $("#note-durations").children("p").remove()
                var durations = data.keyDuration.trim().split(' ')
                durations.forEach(function(duration) {
                    $("#note-durations").append("<p>Note duration: "+duration/1000+"s</p>")
                })
            } else {
                $("#note-durations").children("p").remove()
                $("#note-durations").append("<p>No note is being played.</p>")
            }  

            // if (keypress)
            //     console.log('press');
            //     dSecond = new Date();
            //     var secondsPerBeat = (dSecond - dFirst)/1000;
            //     var beatsPerSecond = 1/secondsPerBeat;
            //     tempo = beatsPerSecond * 60;
            //     dFirst = dSecond;
            //     dSecond = null;
            //     console.log(tempo);
            // });
        },
        error: function (err) {
          console.log('Error: ' + err)
        }
    });
}

setInterval(function() {
    requestData()
}, 100)
