import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';
import EventEmitter from 'events';
import _ from 'lodash';

import SeatApi from 'src/api/seat-api';
import UserStore from 'src/stores/user-store';

const CHANGE_EVENT = 'change';

var _seats = [];

function _userSit(action) {

  let currentUser = UserStore.getCurrentUser();

  if (currentUser._id === action.user._id) {
    console.log(`You sat in seat #${action.seat._id}`);

    if (!action.external)
      SeatApi.sitInSeat(action.seat);
  } else {
    console.log(`${action.user.name} sat in seat #${action.seat._id}`);
  }

  action.seat.user = action.user;
}

function _userStand(action) {

  let currentUser = UserStore.getCurrentUser();

  if (currentUser._id === action.user._id) {
    console.log(`You stood up from seat #${action.seat._id}`);

    if (!action.external)
      SeatApi.standUpFromSeat(action.seat);
  } else {
    console.log(`${action.user.name} stood up from seat #${action.seat._id}`);
  }

  action.seat.user = null;
}

class SeatStore extends EventEmitter {

  bootstrap() {
    // load _seats:
    SeatApi.getAll().then((seats) => {
      seats.forEach((seat) => {
        if (seat.user)
          seat.user = UserStore.get(seat.user._id);
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

  get(_id) {
    return _.find(_seats, { _id });
  }

  getAll() {
    return _seats;
  }

  isUserSitting(user) {
    return _.any(_seats, { user })
  }

}

let seatStoreInstance = new SeatStore();
seatStoreInstance.setMaxListeners(20);
seatStoreInstance.dispatchToken = SeatDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.USER_SIT:
      _userSit(action);
      seatStoreInstance.emitChange();
      break;

    case ActionTypes.USER_STAND:
      _userStand(action);
      seatStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default seatStoreInstance;