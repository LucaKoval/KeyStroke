const express = require('express')
const bodyParser = require('body-parser')
const app = express()

let body = ''

app.set('view engine', 'ejs')
app.use(express.static('public'));

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
