const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

let keyPressed = ''
let keyDuration = ''
let tempo = ''

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/* For actually displaying the pages, including when you click on the navbar links. */
app.get('/index', function (req, res) {
    console.log('they want the GET: index')
    res.render('pages/index')
})

app.get('/data', function (req, res) {
    console.log('they want the GET: data')
    res.render('pages/data')
})

app.get('/visuals', function (req, res) {
    console.log('they want the GET: visuals')
    res.render('pages/visuals')
})

/* Handle post requests */
app.post('/', function (req, res) {
    console.log('they want the POST')
    // console.log('body: ' + JSON.stringify(req.body))
    console.log('keyPressed: ' + req.body.keyPressed)
    keyPressed = req.body.keyPressed
    keyDuration = req.body.keyDuration
    tempo = req.body.tempo
    res.send(req.body)
})

app.post('/update', function(req, res) {
    console.log('they want the POST from update')
    console.log('keyPressed: ' + keyPressed)
    console.log('keyDuration: ' + keyDuration)
    console.log('tempo: ' + tempo)
    res.send({keyPressed: keyPressed, keyDuration: keyDuration, tempo: tempo})
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
