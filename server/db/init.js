require('dotenv').config()

const { User, Class, Request } = require('./database')

async function setupTables() {
  await User.sync({ force: true })
  await Class.sync({ force: true })
  await Request.sync({ force: true })

  await User.bulkCreate([
    {
      name: 'Madhav Varshney',
      email: 'mv@berk',
      pronouns: 'he/him',
      classes: ['CS 61A', 'Math 54'],
    },
    {
      name: 'Mokhalad',
      email: 'mo@berk',
      pronouns: 'he/him',
      classes: ['CS 61A', 'Math 54'],
    }
  ])

  await Class.bulkCreate([
    { code: 'Math 54', title: 'Linear Algebra and Differential Equations' },
    { code: 'CS 61A', title: 'Something Cool' },
    { code: 'CS 61B', title: 'Software Engineering' },
  ])
}

setupTables()

// // Create the "accounts" table.
// Account.sync({
//   force: true,
// })
//   .then(function () {
//     // Insert two rows into the "accounts" table.
//     return Account.bulkCreate([
//       {
//         id: 1,
//         balance: 1000,
//       },
//       {
//         id: 2,
//         balance: 250,
//       },
//     ]);
//   })
//   .then(function () {
//     // Retrieve accounts.
//     return Account.findAll();
//   })
//   .then(function (accounts) {
//     // Print out the balances.
//     accounts.forEach(function (account) {
//       console.log(account.id + " " + account.balance);
//     });
//     process.exit(0);
//   })
//   .catch(function (err) {
//     console.error("error: " + err.message);
//     process.exit(1);
//   });