import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import _ from 'lodash';
import bodyParser from 'body-parser';

import {authorize} from './middleware/auth';
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

// Setup Table:

let _table = new Table();

// Setup Routes:

app.post('/sessions', (req, res) => {
  let session = Session.findOrCreate({ token: req.body.token });
  res.json({ session });
});

app.post('/changeName', authorize, (req, res) => {
  let user = req.currentSession.user;
  user.name = req.body.name;
  _table.broadcast('CHANGE_NAME', user);
  res.json({ user: user })
});

app.get('/user', authorize, (req, res) => {
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

app.post('/sitInSeat', authorize, (req, res) => {
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
  _table.addClient(socket);

  // authenticate:
  socket.on('AUTHENTICATE', (token) => {
    let session = Session.find({ token });
    if (session) {
      _table.identifyConnection(socket, session.user);
    } else {
      console.log(`Connection [${socket.client.conn.id}] tried authenticating without session. Disconnecting...`);
      socket.disconnect();
    }
  });

  // disconnect:
  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.client.conn.id}]`);
    _table.removeClient(socket);
  });
});

server.listen(3000, () => {
  console.log('Booting on http://localhost:3000');
});