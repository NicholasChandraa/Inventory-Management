const socketIO = require('socket.io');

module.exports = {
  init: (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      socket.emit('notification', { message: 'Welcome to the app!' });
    });

    return io;
  }
};
