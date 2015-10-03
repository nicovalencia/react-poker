import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';
import EventEmitter from 'events';
import _ from 'lodash';

import SeatApi from 'src/api/seat-api';
import UserStore from 'src/stores/user-store';

const CHANGE_EVENT = 'change';

var _seats = [];

function _userSit(seat, user) {

  let currentUser = UserStore.getCurrentUser();

  if (currentUser === user) {
    console.log(`You sat in seat #${seat.id}`);
    SeatApi.sitInSeat(seat);
  } else {
    console.log(`${user.name} sat in seat #${seat.id}`);
  }

  seat.user = user;
}

function _userStand(seat, user) {

  let currentUser = UserStore.getCurrentUser();

  if (currentUser === user) {
    console.log(`You stood up from seat #${seat.id}`);
    SeatApi.standUpFromSeat(seat);
  } else {
    console.log(`${user.name} stood up from seat #${seat.id}`);
  }

  seat.user = null;
}

class SeatStore extends EventEmitter {

  bootstrap() {
    // load _seats:
    SeatApi.getAll().then((seats) => {
      seats.forEach((seat) => {
        if (seat.user)
          seat.user = UserStore.get(seat.user.id);
      });
      _seats = seats;
      this.emitChange();
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get(id) {
    return _.find(_seats, { id: id });
  }

  getAll() {
    return _seats;
  }

  getUser(id) {
    return this.get(id).user;
  }

  isUserSitting(user) {
    return _.any(_seats, { user })
  }

}

let seatStoreInstance = new SeatStore();

seatStoreInstance.dispatchToken = SeatDispatcher.register(function(action) {

  let seat = seatStoreInstance.get(action.id);

  switch(action.type) {

    case ActionTypes.USER_SIT:
      _userSit(seat, action.user);
      seatStoreInstance.emitChange();
      break;

    case ActionTypes.USER_STAND:
      _userStand(seat, action.user);
      seatStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default seatStoreInstance;