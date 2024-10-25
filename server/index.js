const express = require('express')
const db = require('./models')
const app = express()

const http = require('http')
const server = http.createServer(app)

server.listen(3000, () => {
  console.log('Server On Port : 3000')
})
