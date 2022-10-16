require('dotenv').config()

const http = require('http')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const asyncHandler = require('express-async-handler')
const Sequelize = require('sequelize-cockroachdb')
const { Server } = require('socket.io')

const { User, Class, Request } = require('./db/database')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3030
const usersToSockets = {}

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.json({ status: 'up' })
})

app.get("/userLogin/:googleId", asyncHandler(async (req, res) => {
  if (!req.params.googleId) {
    return res.status.json({
      error: "GOOGLE ID failed",
      message: "Google api failed"
    })
  }
  const user = await User.findOne({ where: { email } })

  return res.status(201).json({ user });
}))

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll()

  return res.status(200).json(users)
}))

app.post('/users', asyncHandler(async (req, res) => {
  let { name = '', email = '', pronouns } = req.body

  name = name.trim()
  email = email.trim()
  pronouns = pronouns ? pronouns.trim() : pronouns

  if (!name || !email) {
    return res.status(400).json({
      error: 'MISSING_INFORMATION',
      message: 'Name or email not provided'
    })
  }

  const existingUser = await User.findOne({ where: { email } })

  if (existingUser) {
    return res.status(400).json({
      error: 'USER_ALREADY_EXISTS',
      message: 'User already exists'
    })
  }

  const user = await User.create({
    name,
    email,
    pronouns,
    classes: []
  })

  return res.status(200).json({ user })
}))

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } })

  if (!user) {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: 'User not found'
    })
  }

  return res.status(200).json(user)
}))

app.get('/users/:id/classes', asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } })

  if (!user) {
    return res.status(404).json({
      error: 'NOT_FOUND',
      message: 'User not found'
    })
  }

  const classCodes = user.classes
  const classes = await Class.findAll({ where: { code: { [Sequelize.Op.in]: classCodes } } })

  return res.status(200).json(classes)
}))

app.post('/users/:id/classes', asyncHandler(async (req, res) => {
  const { classes } = req.body

  if (!Array.isArray(classes)) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'Classes must be an array'
    })
  }

  const user = await User.update({ classes }, {
    where: {
      id: req.params.id
    }
  })

  res.status(200).json(user)
}))

// TODO: this is for debugging purposes only
app.get('/queue', asyncHandler(async (req, res) => {
  const requests = await Request.findAll()

  return res.status(200).json(requests)
}))

io.on('connection', (socket) => {
  console.log('Connected to new socket')

  // TODO: this is pretty hacky
  let socketUserId = null

  socket.on('disconnect', () => {
    Request.destroy({
      where: {
        requesterId: socketUserId,
      }
    })
  })

  socket.on('join-queue', async (msg, callback) => {
    if (!msg || !msg.classCode || !msg.userId)
      return callback({
        status: 'error',
        error: 'MISSING_DATA',
        message: 'Invalid data provided'
      })

    usersToSockets[msg.userId] = socket;
    socketUserId = msg.userId

    const alreadyQueued = await Request.findOne({
      where: {
        classCode: msg.classCode,
        requesterId: msg.userId,
      }
    })

    if (alreadyQueued) {
      return callback({
        status: 'success',
        action: 'ADDED_TO_QUEUE',
      })
    }

    const queued = await Request.findAll({ where: { classCode: msg.classCode } })

    if (queued.length === 0) {
      // TODO: check if user is already queued
      await Request.create({
        classCode: msg.classCode,
        // TODO: replace userId with user ID from login session
        requesterId: msg.userId
      })

      return callback({
        status: 'success',
        action: 'ADDED_TO_QUEUE',
      })
    } else {
      const users = await Promise.all(
        queued.map(({ requesterId }) => User.findOne({
          where: { id: requesterId }
        }))
      )

      return callback({
        status: 'success',
        users
      })
    }
  })

  socket.on('send-pair-request', async (msg, callback) => {
    if (!msg || !msg.classCode || !msg.userId || !msg.otherUserId)
      return callback({
        status: 'error',
        error: 'MISSING_DATA',
        message: 'Invalid data provided'
      })

    const queuedUser = await Request.findOne({
      where: {
        classCode: msg.classCode,
        requesterId: msg.otherUserId
      }
    })

    if (!queuedUser) {
      return callback({
        status: 'error',
        error: 'USER_NOT_IN_QUEUE',
        message: 'User not found in queue'
      })
    }

    // TODO: what happens if someone is in the middle of pairing? multiple pair requests are currently possible
    // queuedUser.update({ pendingPairId: msg.userId })

    const user = await User.findOne({ where: { id: msg.userId } })

    // TODO: emit acknowledgement
    // return callback({
    //   status: 'success',
    //   action: 'SENT_REQUEST'
    // })

    usersToSockets[msg.otherUserId]
      .timeout(60000)
      .emit('accept-pair-request', { user }, (err, res) => {
        if (res.response === 'accept') {
          queuedUser.destroy().then(() => {
            return callback({
              status: 'success',
              error: 'ACCEPTED_PAIR_REQUEST'
            })
          })
        } else {
          return callback({
            status: 'success',
            error: 'REJECTED_PAIR_REQUEST'
          })
        }
      })
  })
})

server.listen(port, () => {
  console.log(`Study Buddy API server listening on port ${port}`)
})
