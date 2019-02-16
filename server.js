const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'));

let body = ''

app.get('/', function (req, res) {
    console.log('they want to GET')
    // if (req.method === 'POST') {
    //     console.log('they want the POST')
    //     req.on('data', function(data) {
    //         console.log(data.toString())
    //     })
    // }
    req.on('data', function(data) {
        console.log('from get: ' + data.toString())
        body += data.toString()
    })

    console.log('body (from get): ' + body)

    res.render('index', {body: body})
    // res.send('Hello World!')
})

app.post('/', function (req, res) {
    console.log('they want the POST')
    req.on('data', function(data) {
        // console.log(data.toString())
        body += data.toString()
    })

    console.log('body: ' + body)

    // res.send('Hello World! From post!')
    res.render('index', {body: body})
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
