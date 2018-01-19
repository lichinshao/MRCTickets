const io = require('socket.io');

io.on('connection', client => {
  console.log('socket client', client)
})