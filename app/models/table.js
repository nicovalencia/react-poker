import _ from 'lodash';

import Seat from './seat';

class Table {

  constructor() {

    // clients:
    this.clientPool = [];

    // seats:
    this.seats = [];
    _.times(6, ()=> {
      this.seats.push(Seat.create({
        table: this
      }));
    });

  }

  findClientBySocket(socket) {
    return _.find(this.clientPool, (client) => {
      return client.socket === socket;
    });
  }

  addClient(socket) {
    this.clientPool.push({ socket });
    this.broadcast('CLIENT_JOINED');
  }

  hasUser(id) {
    return _.any(this.clientPool, (client) => {
      return client.user && client.user.id == id;
    });
  }

  identifyConnection (socket, user) {
    let client = this.findClientBySocket(socket);
    client.user = user;
    this.broadcast('CLIENT_IDENTIFIED', { user });
  }

  removeClient(socket) {

    let client = this.findClientBySocket(socket);

    // handle seat:
    let seat = Seat.findByUser(client.user.id);
    if (seat) {
      seat.userStand();
    }

    // remove client:
    _.remove(this.clientPool, { socket });

    this.broadcast('CLIENT_LEFT', {
      user: client.user
    });
  }

  broadcast(event, msg) {
    this.clientPool.forEach((client) => {
      client.socket.emit(event, msg);
    });
  }

}

export default Table;