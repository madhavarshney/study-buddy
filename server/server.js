require('dotenv').config()

const http = require('http')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const { Server } = require('socket.io')

const usersRouter = require('./api/users')
const classesRouter = require('./api/classes')
const { queueRouter, onSocketConnection } = require('./api/queue')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3030

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.json({ status: 'up' })
})

app.use('/users', usersRouter)
app.use('/classes', classesRouter)
app.use('/queue', queueRouter)

io.on('connection', onSocketConnection)

server.listen(port, () => {
  console.log(`Study Buddy API server listening on port ${port}`)
})
