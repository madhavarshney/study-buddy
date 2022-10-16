const Sequelize = require('sequelize-cockroachdb')

const db = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' })

const User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: Sequelize.TEXT,
  pronouns: Sequelize.TEXT,
  email: Sequelize.TEXT,
})

const Class = db.define('Class', {
  code: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  title: Sequelize.TEXT,
})

const UserClass = db.define('UserClass', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'users',
    //   key: 'id',
    // }
  },
  classCode: {
    type: Sequelize.TEXT,
    // references: {
    //   model: 'class',
    //   key: 'code',
    // }
  }
})

const Request = db.define('Request', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  requesterId: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'users',
    //   key: 'id',
    // }
  },
  classCode: {
    type: Sequelize.TEXT,
    // references: {
    //   model: 'class',
    //   key: 'code',
    // }
  },
  description: Sequelize.TEXT
})

module.exports = { db, User, Class, UserClass, Request }
