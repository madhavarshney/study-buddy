require('dotenv').config()

const { User, Class, Request } = require('./database')
const berkeleyClasses = require('./berkeleyClasses.json')

async function setupTables() {
  await User.sync({ force: true })
  await Class.sync({ force: true })
  await Request.sync({ force: true })

  await Class.bulkCreate(berkeleyClasses)

  await User.bulkCreate([
    {
      name: 'Madhav Varshney',
      pronouns: 'he/him',
      // googleId: '115816483171262773283',
      email: 'madhavarsney@gmail.com',
      profilePicture: 'https://www.w3schools.com/howto/img_avatar2.png',
      phoneNumber: '+1 (500) 400-1600',
      instagram: '@mv_cal',
      classes: ['CS 61A', 'Math 54'],
    },
    {
      name: 'Mokhalad',
      email: 'mo@berk',
      pronouns: 'he/him',
      profilePicture: 'https://www.w3schools.com/howto/img_avatar2.png',
      phoneNumber: '+1 (300) 600-6900',
      instagram: '@mv_cal',
      classes: ['CS 61A', 'Math 54'],
    },
  ])
}

setupTables()
