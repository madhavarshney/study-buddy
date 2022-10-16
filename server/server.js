require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const asyncHandler = require('express-async-handler')

const { User } = require('./db/database')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.json({ status: 'up' })
})

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();

  return res.status(200).json(users);
}))

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' })
  }

  return res.status(200).json(user);
}))

app.post('/users', asyncHandler(async (req, res) => {
  console.log(req.body)

  let { name = '', email = '', pronouns } = req.body;

  name = name.trim()
  email = email.trim()
  pronouns = pronouns ? pronouns.trim() : pronouns

  if (!name || !email) {
    return res.status(400).json({
      error: 'MISSING_INFORMATION',
      message: 'Name or email not provided'
    })
  }

  const existingUser = await User.findOne({ where: { email } });

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
  });

  return res.status(200).json({ user });
}))

app.listen(port, () => {
  console.log(`Study Buddy API server listening on port ${port}`)
})
