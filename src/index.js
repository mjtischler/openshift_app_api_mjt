/* eslint-disable no-console */
import server from 'http';
import io from 'socket.io';
import jwt from 'jsonwebtoken';
import getAuthValues from './auth.js';

const environment = process.env.NODE_ENV || 'production';
const port = process.env.COMPONENT_BACKEND_PORT || 8081;
const socketIp = process.env.COMPONENT_BACKEND_HOST || null;
const ioServer = server.createServer()
const ioSocket = io(ioServer);
const sequenceNumberByClient = new Map();
const auth = getAuthValues(process.env || null);

ioSocket.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, auth.socketTokenSecret, (err, decoded) => {
      if (err) {
        console.log(`${err}`);
        return next(new Error('Authentication error'));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    console.log('Other authentication error');
    next(new Error('Authentication error'));
  }    
}).on('connection', (socket) => {
    const { address, time } = socket.handshake;
    console.log(`Client connected on socket [id=${socket.id}] [ip=${address}] [time=${time}]`);
    sequenceNumberByClient.set(socket, 1);

    socket.on('clientEvent', (userId, callback) => {
      callback('Data Received from Socket');

      console.log(`Received request [userId=${userId}] [socket=${socket.id}]`);
      socket.emit('serverResponse', 'Data Received from Socket');
    });

    socket.on('disconnect', () => {
      sequenceNumberByClient.delete(socket);
      console.log(`Client disconnected from socket [id=${socket.id}]`);
    });
});

ioServer.listen(port, socketIp, () => console.log(`Socket.io listening [port=${port}] [environment=${environment}]`));

export default ioServer;
