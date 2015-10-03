import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import _ from 'lodash';
import bodyParser from 'body-parser';

import auth from './middleware/auth';
import Session from './models/session';
import Seat from './models/seat';

const app = express();
const server = http.Server(app);
const io = ioServer(server);

// Setup Table:

_.times(6, ()=> {
  return Seat.create();
});

// Setup app:

app.use(express.static('../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);

app.post('/sessions', (req, res) => {
  let session = Session.findOrCreate({ token: req.body.token });
  res.json({ session });
});

app.post('/changeName', (req, res) => {
  req.currentSession.user.name = req.body.name;
  res.json({ user: req.currentSession.user })
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
    res.json({ ok: true });
  } else {
    res.status(500).json({ error: "Cannot sit in seat" });
  }
});

app.post('/standUpFromSeat', (req, res) => {
  let seat = Seat.find(req.body.seat.id);
  if (seat && seat.userStand()) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ error: "Cannot stand up from seat" });
  }
});

io.on('connection', (socket) => {
	// connect:
  console.log(`User connected [${socket.client.conn.id}]`);

  // disconnect:
  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.client.conn.id}]`);
  });
});

server.listen(3000, () => {
  console.log('Booting on http://localhost:3000');
});