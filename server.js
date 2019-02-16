const express = require('express')
const bodyParser = require('body-parser')
const app = express()

let body = ''

app.set('view engine', 'ejs')
app.use(express.static('public'));

/* For actually displaying the pages, including when you click on the navbar links. */
app.get('/index', function (req, res) {
    console.log('they want the GET: index')

    var sports = [
        { name: 'Football', difficulty: 3 },
        { name: 'Soccer', difficulty: 5 },
        { name: 'Curling', difficulty: 10 }
    ];
    var tagline = "When you herp, you derp.";

    res.render('pages/index', {
        sports: sports,
        tagline: tagline
    })
})

app.get('/data', function (req, res) {
    console.log('they want the GET: data')
    res.render('pages/data')
})

app.get('/visuals', function (req, res) {
    console.log('they want the GET: visuals')
    res.render('pages/visuals')
})

app.post('/', function (req, res) {

    console.log('they want the POST')
    req.on('data', function(data) {
        body += data.toString()
    })

    console.log('body: ' + body)

    res.render('pages/index', {body: body})
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
