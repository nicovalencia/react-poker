import express from 'express';
import http from 'http';
import ioServer from 'socket.io';

const app = express();
const server = http.Server(app);
const io = ioServer(server);

app.use(express.static('../public'));

io.on('connection', (socket) => {
  console.log(`User connected [${socket.client.conn.id}]`);
  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.client.conn.id}]`);
  });
});

server.listen(3000, () => {
  console.log('Booting on http://localhost:3000');
});