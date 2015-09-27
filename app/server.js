import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import _ from 'lodash';
import bodyParser from 'body-parser';

const app = express();
const server = http.Server(app);
const io = ioServer(server);

app.use(express.static('../public'));
app.use(bodyParser.json());

let _sessions = [];

function findSession(token) {
  return _.find(_sessions, { token });
}

let userIdCounter = 1;
function createSession() {
  let session = {
    token: `${_.random(1e10)}-${_.random(1e10)}-${_.random(1e10)}`,
    user: {
      id: userIdCounter,
      name: `New Player ${userIdCounter}`
    }
  };
  userIdCounter++;
  _sessions.push(session);
  return session;
}

app.post('/sessions', (req, res) => {
  let session = _.find(_sessions, { token: req.body.token }) || createSession();
  res.json({ session });
});

app.post('/changeName', (req, res) => {
  let session = findSession(req.headers['x-token']);
  session.user.name = req.body.name;
  res.json({ user: session.user })
});

app.get('/user', (req, res) => {
  let session = findSession(req.headers['x-token']);
  res.json({ user: session.user })
});

app.get('/users', (req, res) => {
  res.json({
    users: _.pluck(_sessions, 'user')
  });
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