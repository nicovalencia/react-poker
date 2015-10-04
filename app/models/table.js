import mongoose from 'mongoose';
import _ from 'lodash';

import {seatSchema} from './seat';
import {userSchema} from './user';

let _clientPool = [];

let schema = mongoose.Schema({
  name: String,
  clientPool: {
    type: Array,
    default: []
  },
  seats: [seatSchema],
  users: [userSchema]
});

schema.statics.build = function build(opts) {

  console.log('Building table with seats...');
  return new Table(Object.assign({
    seats: _.times(6, (seat) => {
      return { position: seat };
    })
  }, opts));

};

schema.pre('validate', function(next) {

  if (this.seats.length !== 6) {
    console.log('Initializing table with seats:');
  }

  next();
});

schema.methods.addClient = function addClient(socket, cb) {
  _clientPool.push({
    table: this,
    socket
  });
  this.broadcast('CLIENT_JOINED');
};

schema.methods.findClientBySocket = function findClientBySocket(socket) {
  return _.find(_clientPool, (client) => {
    return client.socket === socket;
  });
};

schema.methods.identifyConnection = function identifyConnection(opts, cb) {
  let client = this.findClientBySocket(opts.socket);
  client.user = opts.user;
  this.save((err) => {
    if (err) cb(err);
    cb(null, this);
    this.broadcast('CLIENT_IDENTIFIED', {
      user: client.user
    });
  });
};

schema.methods.removeClient = function removeClient(socket, cb) {
  let client = this.findClientBySocket(socket);

  // handle seat:
  // this.seats.find()
  //   .where('user._id').equals(client.user._id)
  //   .exec((err, seat) => {
  //     if (err) cb(err);

  //     if (seat) {
  //       seat.userStand();
  //     }

  //   });

  // remove client:
  _.remove(_clientPool, { socket });

  this.broadcast('CLIENT_LEFT', {
    user: client.user
  });

};

schema.methods.broadcast = function broadcast(event, msg) {
  _.where(_clientPool, { table: this }).forEach((client) => {
    client.socket.emit(event, msg);
  });
};

schema.methods.addUser = function adduser(user) {
  return new Promise((resolve, reject) => {
    this.users.push(user);
    this.save((err, user) => {
      if (err) reject(err);
      resolve(this);
    });
  });
};

let Table = mongoose.model('Table', schema);

export {schema as tableSchema};
export default Table;