import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import _ from 'lodash';
import bodyParser from 'body-parser';

import auth from './middleware/auth';
import Session from './models/session';
import Seat from './models/seat';
import Table from './models/table';

const app = express();
const server = http.Server(app);
const io = ioServer(server);

// Setup App:

app.use(express.static('../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);

// Setup Table:

let _table = new Table();

// Setup Routes:

app.post('/sessions', (req, res) => {
  let session = Session.findOrCreate({ token: req.body.token });
  res.json({ session });
});

app.post('/changeName', (req, res) => {
  let user = req.currentSession.user;
  user.name = req.body.name;
  _table.broadcast('CHANGE_NAME', user);
  res.json({ user: user })
});

app.get('/user', (req, res) => {
  res.json({ user: req.currentSession.user })
});

app.get('/users', (req, res) => {
  res.json({
    users: _.pluck(Session.getAll(), 'user')
  });
});

app.get('/seats', (req, res) => {
  res.json({
    seats: Seat.getAll()
  });
});

app.post('/sitInSeat', (req, res) => {
  let seat = Seat.find(req.body.seat.id);
  if (seat && seat.userSit(req.currentSession.user)) {
    _table.broadcast('USER_SIT', {
      user: req.currentSession.user,
      seat
    });
    res.json({ ok: true });
  } else {
    res.status(500).json({ error: "Cannot sit in seat" });
  }
});

app.post('/standUpFromSeat', (req, res) => {
  let seat = Seat.find(req.body.seat.id);
  if (seat && seat.userStand()) {
    _table.broadcast('USER_STAND', {
      user: req.currentSession.user,
      seat
    });
    res.json({ ok: true });
  } else {
    res.status(500).json({ error: "Cannot stand up from seat" });
  }
});

io.on('connection', (socket) => {
	// connect:
  console.log(`User connected [${socket.client.conn.id}]`);
  _table.addClient(socket);

  // disconnect:
  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.client.conn.id}]`);
    _table.removeClient(socket);
  });
});

server.listen(3000, () => {
  console.log('Booting on http://localhost:3000');
});