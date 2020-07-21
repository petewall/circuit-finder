#!/usr/bin/env node

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const WebSocket = require('ws')

const httpPort = 3000
const websocketPort = 1337

const socketServer = new WebSocket.Server({
    port: websocketPort
})
socketServer.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log('received: %s', message)
        socket.send("pong")
    })
})
  
app.use('/', express.static('../../data'))
http.listen(httpPort, () => console.log(`Test service running at http://localhost:${httpPort}`))
