// const http = require('http')
// const port = 8000

// const requestHandler = (request, response) => {
//     if (request) console.log('they want the request')
//     if (request.method === 'GET') console.log('they want to GET')
//     if (request.method === 'POST') {
//         console.log('they want the POST')
//         request.on('data', function(data) {
//             console.log(data.toString())
//         })
//     }
    
//     console.log(request.url)
//     response.end('Hello Node.js Server!')
// }

// const server = http.createServer(requestHandler)

// server.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err)
//     }

//     console.log(`server is listening on ${port}`)
// })


// const express = require('express')
// const app = express()

// app.get('/', function (req, res) {
//     if (req) console.log('they want the request')
//     if (req.method === 'GET') console.log('they want to GET')
//     if (req.method === 'POST') {
//         console.log('they want the POST')
//         req.on('data', function(data) {
//             console.log(data.toString())
//         })
//     }

//     res.send('Hello World!')
// })

// app.listen(8000, function () {
//     console.log('Example app listening on port 3000!')
// })
