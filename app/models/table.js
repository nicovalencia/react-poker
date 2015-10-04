import mongoose from 'mongoose';
import _ from 'lodash';

import {seatSchema, Seat} from './seat';

let tableSchema = mongoose.Schema({
  name: String,
  clientPool: {
    type: Array,
    default: []
  },
  seats: [seatSchema]
});

tableSchema.statics.build = function build(opts) {

  console.log('Building table with seats...');
  return new Table(Object.assign({
    seats: _.times(6, (seat) => {
      return { position: seat };
    })
  }, opts));

};

tableSchema.pre('validate', function(next) {

  if (this.seats.length !== 6) {
    console.log('Initializing table with seats:');
  }

  next();
});

tableSchema.methods.addClient = function addClient(socket, cb) {
  this.clientPool.push({ socket });
  this.save((err) => {
    if (err) cb(err);
    cb(null, this);
    this.broadcast('CLIENT_JOINED');
  });
};

tableSchema.methods.findClientBySocket = function findClientBySocket(socket) {
  return _.find(this.clientPool, (client) => {
    return client.socket === socket;
  });
};

tableSchema.methods.identifyConnection = function identifyConnection(opts, cb) {
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

tableSchema.methods.removeClient = function removeClient(socket, cb) {
  let client = this.findClientBySocket(socket);

  // handle seat:
  Seat.findOne()
    .where('user._id').equals(client.user._id)
    .exec((err, seat) => {
      if (err) cb(err);

      if (seat) {
        seat.userStand();
      }

    });

  // remove client:
  _.remove(this.clientPool, { socket });

  this.broadcast('CLIENT_LEFT', {
    user: client.user
  });

};

tableSchema.methods.broadcast = function broadcast(event, msg) {
  this.clientPool.forEach((client) => {
    client.socket.emit(event, msg);
  });
};

let Table = mongoose.model('Table', tableSchema);

export default Table;