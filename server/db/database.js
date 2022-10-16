const Sequelize = require('sequelize-cockroachdb')

const db = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' })

const User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.TEXT,
  pronouns: Sequelize.TEXT,
  email: Sequelize.TEXT,
  googleId: {
    unique: true,
    type: Sequelize.TEXT,
  },
  classes: Sequelize.ARRAY(Sequelize.TEXT),
})

const Class = db.define('Class', {
  code: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  title: Sequelize.TEXT,
})

// const UserClass = db.define('UserClass', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//   },
//   userId: {
//     type: Sequelize.INTEGER,
//   },
//   classCode: {
//     type: Sequelize.TEXT,
//   }
// })

const Request = db.define('Request', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requesterId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  classCode: {
    type: Sequelize.TEXT,
  },
  // pendingPairId: {
  //   type: Sequelize.INTEGER,
  // },
  description: Sequelize.TEXT,
})

module.exports = { db, User, Class, Request }
