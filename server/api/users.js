const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize-cockroachdb')
const asyncHandler = require('express-async-handler')

const { User, Class } = require('../db/database')

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await User.findAll()

    return res.status(200).json(users)
  })
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    let { name = '', email = '', pronouns } = req.body

    name = name.trim()
    email = email.trim()
    pronouns = pronouns ? pronouns.trim() : pronouns

    if (!name || !email) {
      return res.status(400).json({
        error: 'MISSING_DATA',
        message: 'Name or email not provided',
      })
    }

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.status(400).json({
        error: 'USER_ALREADY_EXISTS',
        message: 'User already exists',
      })
    }

    const user = await User.create({
      name,
      email,
      pronouns,
      classes: [],
    })

    return res.status(201).json({ user })
  })
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    let { name, email, googleId } = req.body
    let pronouns = 'male'

    const user = await User.findOne({ where: { googleId }, raw: true })

    if (user) {
      return res.status(200).json({ user })
    }

    const newUser = await User.create({
      name,
      email,
      pronouns,
      googleId,
      classes: [],
    })

    return res.status(201).json({ newUser })
  })
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } })

    if (!user) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return res.status(200).json(user)
  })
)

router.get(
  '/:id/classes',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } })

    if (!user) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    const classCodes = user.classes
    const classes = await Class.findAll({
      where: { code: { [Sequelize.Op.in]: classCodes } },
    })

    return res.status(200).json(classes)
  })
)

router.post(
  '/:id/classes',
  asyncHandler(async (req, res) => {
    const { classes } = req.body

    if (!Array.isArray(classes)) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Classes must be an array',
      })
    }

    const user = await User.update(
      { classes },
      {
        where: {
          id: req.params.id,
        },
      }
    )

    res.status(200).json(user)
  })
)

module.exports = router
