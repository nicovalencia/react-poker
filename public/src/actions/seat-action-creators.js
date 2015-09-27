import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';

let SeatActionCreators = {

  playerSit(opts) {
    SeatDispatcher.dispatch({
      type: ActionTypes.PLAYER_SIT,
      id: opts.id,
      player: opts.player
    });
  },

  playerStand(id) {
    SeatDispatcher.dispatch({
      type: ActionTypes.PLAYER_STAND,
      id: id
    });
  }

}

export default SeatActionCreators;