const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const registerHandlers = require('../sockets');


function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use(socketAuth); 

  console.log('Socket.IO جاهز ✅');

  io.on('connection', (socket) => {
    console.log(`مستخدم اتصل: ${socket.id}`);
    registerHandlers(io, socket);
  });

  return io;
}

module.exports = initSocket;
