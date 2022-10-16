const { io } = require('socket.io-client');

const mv = io('http://localhost:3000');
const mo = io('http://localhost:3000');

const mvId = '805534814819352578';
const moId = '805534814819450882';
const classCode = 'Math 54';

mv.emit('join-queue', { userId: mvId, classCode }, (res) => {
  console.log(res);

  mo.emit('join-queue', { userId: moId, classCode }, (res) => {
    console.log(res);

    mo.emit('send-pair-request', { userId: moId, classCode, otherUserId: res.users[0].id }, (res) => {
      console.log(res)
    })
  });
});

mv.on('accept-pair-request', ({ user }, callback) => {
  console.log('Accepting', user);

  callback({ response: 'accept' })
})
