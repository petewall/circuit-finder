#!/usr/bin/env node

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

// io.on('connection', (socket) => {
//     console.log('Client connected!')
//   socket.join(['server-updates', 'sensor-updates'])
// })

app.use('/', express.static('.'))
http.listen(port, () => console.log(`Test service running at http://localhost:${port}`))
