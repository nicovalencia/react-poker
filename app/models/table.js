import _ from 'lodash';

import Seat from './seat';

class Table {

  constructor() {

    // clients:
    this.clientPool = [];

    // seats:
    this.seats = [];
    _.times(6, ()=> {
      this.seats.push(Seat.create());
    });

  }

  addClient(socket) {
    this.clientPool.push(socket);
  }

  removeClient(socket) {
    _.remove(this.clientPool, socket);
  }

  broadcast(event, msg) {
    this.clientPool.forEach((client) => {
      client.emit(event, msg);
    });
  }

}

export default Table;