require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const { db } = require('./db/database')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.json({ status: 'up' })
})

app.listen(port, () => {
  console.log(`Study Buddy API server listening on port ${port}`)
})
