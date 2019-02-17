const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

let keyPressed = ''

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/* For actually displaying the pages, including when you click on the navbar links. */
app.get('/index', function (req, res) {
    console.log('they want the GET: index')
    console.log('GET msg: ' + JSON.stringify(req.body))
    res.render('pages/index', { keyPressed: keyPressed })
})

app.get('/data', function (req, res) {
    console.log('they want the GET: data')
    res.render('pages/data', { keyPressed: keyPressed })
})

app.get('/visuals', function (req, res) {
    console.log('they want the GET: visuals')
    res.render('pages/visuals', { keyPressed: keyPressed })
})

/* Handle post requests */
app.post('/', function (req, res) {
    // console.log('they want the POST')
    // console.log('keyPressed: ' + req.body.keyPressed)
    keyPressed = req.body.keyPressed
    res.send(req.body)
})

app.post('/update', function(req, res) {
    console.log('they want the POST from update')
    console.log('keyPressed: ' + keyPressed)
    res.send(keyPressed)
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
