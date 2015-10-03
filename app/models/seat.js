import _ from 'lodash';

let _seats = [];
let seatIdCounter = 1;

class Seat {

  constructor(opts) {
    this.table = opts.table;
    this.id = seatIdCounter++;
    this.user = null;
  }

  userSit(user) {

    if (!this.table.hasUser(user.id)) {
      console.error('User is not at table. Cannot sit here.')
      return false;
    } else if (this.user) {
      console.error('Another user is sitting at this seat.')
      return false;
    } else {

      this.user = user;
      
      console.log(`> ${user.name} sat in seat #${this.id}`);
      this.table.broadcast('USER_SIT', {
        seat: this,
        user
      });

      return this;
    }

  }

  userStand() {

    this.table.broadcast('USER_STAND', {
      seat: this,
      user: this.user
    });
    console.log(`> ${this.user.name} stood up from seat #${this.id}`);

    this.user = null;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user
    }
  }

}

class SeatInterface {

  create(opts) {
    let seat = new Seat(opts);
    _seats.push(seat);
    return seat;
  }

  find(id) {
    id = parseInt(id);
    return _.find(_seats, { id });
  }

  findByUser(id) {
    return _.find(_seats, (seat) => {
      return seat.user && seat.user.id == id;
    });
  }

  getAll() {
    return _seats;
  }

}

export default new SeatInterface();