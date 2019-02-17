const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

let body = ''

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/* For actually displaying the pages, including when you click on the navbar links. */
app.get('/index', function (req, res) {
    console.log('they want the GET: index')
    // res.render('pages/index', { body: body })
    console.log('GET msg: ' + JSON.stringify(req.body))
    res.render('pages/index', { msg: body })
})

app.get('/data', function (req, res) {
    console.log('they want the GET: data')
    res.render('pages/data', { msg: body })
})

app.get('/visuals', function (req, res) {
    console.log('they want the GET: visuals')
    res.render('pages/visuals', { msg: body })
})

/* Handle post requests */
app.post('/', function (req, res) {
    console.log('they want the POST')
    console.log('msg: ' + req.body.msg)
    body = JSON.stringify(req.body.msg)
    res.send(req.body)
})

app.post('/update', function(req, res) {
    res.send(body)
})


app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
