require('dotenv').config()

const { Request } = require('./database')

;(async () => {
  await Request.destroy({
    where: {},
    truncate: true,
  })
})()
