import express from 'express';
import http from 'http';
import ioServer from 'socket.io';
import _ from 'lodash';
import bodyParser from 'body-parser';

import {authorize} from './middleware/auth';
import {fetchTable} from './middleware/fetch-table';
import Database from './db/database';
import Session from './models/session';
import Table from './models/table';

const app = express();
const server = http.Server(app);
const io = ioServer(server);

// Setup App:

app.use(express.static('../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Routes:

app.post('/sessions', (req, res, next) => {
  Session.findOrCreate(req.body.token).then((session) => {

    // (temporary) - assign main table to session:
    session.tables = [_table];
    session.save((err, session) => {
      if (err) next(err);
      res.json({ session });
    });

  }).catch(next);
});

// Table:

app.get('/tables/:id', authorize, (req, res, next) => {
  Table.findById(req.params.id, (err, table) => {
    if (err) next(err);

    table.addUser(req.currentSession.user).then((table) => {
      res.json({ table });
    });

  });
});

// RPC:

app.get('/user', authorize, (req, res) => {
  res.json({ user: req.currentSession.user })
});

app.post('/changeName', authorize, fetchTable, (req, res, next) => {
  let user = req.currentSession.user;
  user.changeName(req.body.name, (err, updatedUser) => {
    if (err) next(err);
    req.table.broadcast('CHANGE_NAME', updatedUser);
    res.json({ user: updatedUser })
  });
});

app.post('/sitInSeat', authorize, fetchTable, (req, res, next) => {
  let seat = req.table.seats.id(req.body.seat._id);
  seat.userSit(req.currentSession.user).then((seat) => {
    console.log(`> ${req.currentSession.user.name} sat in seat #${seat._id}`);
    req.table.broadcast('USER_SIT', {
      seat,
      user: req.currentSession.user
    });
    res.json({ ok: true });
  }).catch(next);
});

app.post('/standUpFromSeat', authorize, fetchTable, (req, res, next) => {
  req.table.seats.findById(req.body.seat._id, (err, seat) => {
    if (err) next(err);

    seat.userStand((err) => {
      if (err) {
        res.status(500).json({ error: "Cannot stand up from seat" });
      } else {
        res.json({ ok: true });
      }
    });
  });
});

io.on('connection', (socket) => {
	// connect:
  console.log(`User connected [${socket.client.conn.id}]`);
  _table.addClient(socket, (err) => {
    if (err) console.log(err);
  });

  // authenticate:
  socket.on('AUTHENTICATE', (token) => {
    Session.findOne()
      .where('token').equals(token)
      .populate('user')
      .exec((err, session) => {
        if (session) {
          _table.identifyConnection({
            socket: socket,
            user: session.user
          }, (err) => {
            if (err) console.log(err);
          });
        } else {
          console.log(`Connection [${socket.client.conn.id}] tried authenticating without session. Disconnecting...`);
          socket.disconnect();
        }
      });
  });

  // disconnect:
  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.client.conn.id}]`);
    _table.removeClient(socket, (err) => {
      if (err) console.log(err);
    });
  });
});

// Table instance:
let _table;

let dbName = 'test';
let db = new Database(dbName);

db.connect((err) => {
  console.error('Mongoose: error connecting to ${dbName}:', err);
}, () => {
  console.log(`Mongoose: connected to ${dbName} successfully!`);


  // Setup Table:
  _table = Table.build({ name: 'Main Table' });
  _table.save((err) => {
    server.listen(3000, () => {
      console.log('Booting server on http://localhost:3000');
    });
  });

});

