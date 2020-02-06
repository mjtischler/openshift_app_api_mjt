/* eslint-disable no-console */
import server from 'http';
import io from 'socket.io';
import jwt from 'jsonwebtoken';
import auth from './auth.js';

const environment = process.env.NODE_ENV || 'production';
const port = 8081;
const socketIp = environment === 'production' ? '0.0.0.0' : null;
const ioServer = server.createServer()
const ioSocket = io(ioServer);
const sequenceNumberByClient = new Map();

ioSocket.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, auth.socketTokenSecret, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }    
}).on('connection', (socket) => {
    console.log(`Client connected on socket [id=${socket.id}]`);
    sequenceNumberByClient.set(socket, 1);

    socket.on('clientEvent', (userId, callback) => {
      callback('Data Received from Socket');

      console.log(`Received request from userId ${userId} on socket ${socket.id}`);
      socket.emit('serverResponse', 'Data Received from Socket');
    });

    socket.on('disconnect', () => {
      sequenceNumberByClient.delete(socket);
      console.log(`Client disconnected from socket [id=${socket.id}]`);
    });
});

ioServer.listen(port, socketIp, () => console.log(`Socket.io listening on port ${port} in the ${environment} environment`));

export default ioServer;
