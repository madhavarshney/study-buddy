require('dotenv').config()

const { User, Class, Request } = require('./database')

async function setupTables() {
  await User.sync({ force: true })
  await Class.sync({ force: true })
  await Request.sync({ force: true })

  await Class.bulkCreate([
    { code: 'Math 54', title: 'Linear Algebra and Differential Equations' },
    { code: 'CS 61A', title: 'Something Cool' },
    { code: 'CS 61B', title: 'Software Engineering' },
  ])

  await User.bulkCreate([
    {
      name: 'Madhav Varshney',
      email: 'mv@berk',
      pronouns: 'he/him',
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
