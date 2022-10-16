const express = require('express')
const router = express.Router()

const { Class } = require('../db/database')

router.get('/', async (req, res) => {
  const classes = await Class.findAll()

  return res.status(200).json(classes)
})

module.exports = router
