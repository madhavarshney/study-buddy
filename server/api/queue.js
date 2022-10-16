const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { User, Class, Request } = require('../db/database')

// TODO: store user-socket mappings in a better way
const usersToSockets = {}

// TODO: this is for debugging purposes only
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const requests = await Request.findAll()

    return res.status(200).json(requests)
  })
)

const onSocketConnection = (socket) => {
  console.log('Connected to new socket')

  // TODO: this is pretty hacky
  let socketUserId = null
  let prevJoinQueue = null

  socket.on('disconnect', () => {
    if (socketUserId) {
      Request.destroy({
        where: {
          requesterId: socketUserId,
        },
      })
    }
  })

  /**
   * Handler to join the queue for a class, or get the list of people
   * on the queue if there are already people on it.
   */
  socket.on('join-queue', async (msg, callback) => {
    // TODO: replace userId with user ID from login session
    if (!msg || !msg.classCode || !msg.userId) {
      return callback({
        status: 'error',
        error: 'MISSING_DATA',
        message: 'Invalid data provided',
      })
    }

    // This is a dumb/hacky lock mechanism. If this function is run twice fast in succession,
    // it will wait for the previous call to finish before running it again.
    if (prevJoinQueue) await prevJoinQueue

    let resolve
    prevJoinQueue = new Promise((res, rej) => {
      resolve = res
    })

    resolveAndCb = (data) => {
      resolve()
      callback(data)
    }

    usersToSockets[msg.userId] = socket
    socketUserId = msg.userId

    // Make sure class exists
    const classData = await Class.findOne({ where: { code: msg.classCode } })

    if (!classData) {
      return resolveAndCb({
        status: 'error',
        error: 'CLASS_NOT_FOUND',
        message: 'Class not found',
      })
    }

    // Check if user is already on queue
    const alreadyQueued = await Request.findOne({
      where: {
        classCode: msg.classCode,
        requesterId: msg.userId,
      },
    })

    if (alreadyQueued) {
      return resolveAndCb({
        status: 'success',
        action: 'ADDED_TO_QUEUE',
      })
    }

    // Find all requests on the queue for this class
    const queued = await Request.findAll({
      where: { classCode: msg.classCode },
    })

    if (queued.length === 0) {
      // We're the first on the queue
      try {
        await Request.create({
          classCode: msg.classCode,
          requesterId: msg.userId,
        })
      } catch (err) {
        console.error(err)

        return resolveAndCb({
          status: 'error',
          error: 'DB_ERROR',
          message: 'Something went wrong while adding to queue',
        })
      }

      return resolveAndCb({
        status: 'success',
        action: 'ADDED_TO_QUEUE',
      })
    }

    // Otherwise, fetch the user data for each person on the queue (excluding yourself)
    // TODO: do a join to keep both data from the requests table and user table
    const users = (
      await Promise.all(
        queued.map(({ requesterId }) =>
          requesterId !== msg.userId
            ? User.findOne({ where: { id: requesterId } })
            : null
        )
      )
    ).filter((x) => !!x)

    return resolveAndCb({
      status: 'success',
      action: 'RETURNED_QUEUE_USERS',
      users,
    })
  })

  socket.on('leave-queue', async (msg) => {
    if (msg.userId) {
      await Request.destroy({ where: { requesterId: msg.userId } })
    }
  })

  /**
   * Handler for when a user chooses a person and sends a pair request
   */
  socket.on('send-pair-request', async (msg, callback) => {
    if (!msg || !msg.classCode || !msg.userId || !msg.otherUserId) {
      return callback({
        status: 'error',
        error: 'MISSING_DATA',
        message: 'Invalid data provided',
      })
    }

    const queuedUser = await Request.findOne({
      where: {
        classCode: msg.classCode,
        requesterId: msg.otherUserId,
      },
    })

    if (!queuedUser) {
      return callback({
        status: 'error',
        error: 'USER_NOT_IN_QUEUE',
        message: 'User not found in queue',
      })
    }

    // TODO: what happens if someone is in the middle of pairing? multiple pair requests are currently possible
    // queuedUser.update({ pendingPairId: msg.userId })

    const user = await User.findOne({ where: { id: msg.userId } })
    const otherUser = await User.findOne({ where: { id: msg.otherUserId } })

    // TODO: emit acknowledgement
    // return callback({
    //   status: 'success',
    //   action: 'SENT_REQUEST'
    // })

    usersToSockets[msg.otherUserId]
      .timeout(30000)
      .emit('accept-pair-request', { user }, (err, res) => {
        if (!err && res.response === 'accept') {
          queuedUser.destroy().then(() => {
            usersToSockets[msg.otherUserId].emit('paired', { user })
            socket.emit('paired', { user: otherUser })

            callback({
              status: 'success',
              action: 'ACCEPTED_PAIR_REQUEST',
            })
          })
        } else {
          return callback({
            status: 'success',
            action: 'REJECTED_PAIR_REQUEST',
          })
        }
      })
  })
}

module.exports = { queueRouter: router, onSocketConnection }
