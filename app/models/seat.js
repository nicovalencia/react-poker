import _ from 'lodash';

let _seats = [];
let seatIdCounter = 1;

class Seat {

  constructor() {
    this.id = seatIdCounter++;
    this.user = null;
  }

  userSit(user) {
    if (this.user) {
      return false;
    } else {
      console.log(`> ${user.name} sat in seat #${this.id}`);
      this.user = user;
      return this;
    }
  }

  userStand() {
    console.log(`> ${this.user.name} stood up from seat #${this.id}`);
    this.user = null;
    return this;
  }

}

class SeatInterface {

  create() {
    let seat = new Seat();
    _seats.push(seat);
    return seat;
  }

  find(id) {
    id = parseInt(id);
    return _.find(_seats, { id });
  }

  getAll() {
    return _seats;
  }

}

export default new SeatInterface();