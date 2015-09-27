import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';
import EventEmitter from 'events';
import _ from 'lodash';

const CHANGE_EVENT = 'change';

var _seats = _.times(6, (i) => {
  return {
    id: i+1,
    player: null
  };
});

function _playerSit(seat, player) {
  console.log(`websocket: ${player.name} sat in seat #${seat.id}`);
  seat.player = player;
}

function _playerStand(seat) {
  console.log(`websocket: ${seat.player.name} stood up from seat #${seat.id}`);
  seat.player = null;
}

class SeatStore extends EventEmitter {

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

  getPlayer(id) {
    return this.get(id).player;
  }

  isPlayerSitting(player) {
    return _.any(_seats, { player })
  }

}

let seatStoreInstance = new SeatStore();

seatStoreInstance.dispatchToken = SeatDispatcher.register(function(action) {

  let seat = seatStoreInstance.get(action.id);

  switch(action.type) {

    case ActionTypes.PLAYER_SIT:
      _playerSit(seat, action.player);
      seatStoreInstance.emitChange();
      break;

    case ActionTypes.PLAYER_STAND:
      _playerStand(seat);
      seatStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default seatStoreInstance;