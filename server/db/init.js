require('dotenv').config()

const { User, Class, UserClass, Request } = require('./database')

async function setupTables() {
  await User.sync({ force: true });
  await Class.sync({ force: true });
  await UserClass.sync({ force: true });
  await Request.sync({ force: true });
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