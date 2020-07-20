#!/usr/bin/env node

const express = require('express')
const app = express()
const http = require('http').createServer(app)
require('socket.io')(http)

app.use('/', express.static('../data'))

const port = 3000
http.listen(port, () => console.log(`Test service running at http://localhost:${port}`))
