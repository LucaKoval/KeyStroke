const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', function (req, res) {
    console.log('they want the GET')
    res.render('index')
})

app.post('/', function (req, res) {
    let body = ''
    
    console.log('they want the POST')
    req.on('data', function(data) {
        body += data.toString()
    })

    console.log('body: ' + body)

    res.render('index', {body: body})
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
