const socketIo = require('socket.io');

let io;

const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "https://inventory-management-rose.vercel.app",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { init, getIO };
