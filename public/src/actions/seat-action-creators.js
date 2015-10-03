import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';

let SeatActionCreators = {

  userSit(opts) {
    SeatDispatcher.dispatch({
      type: ActionTypes.USER_SIT,
      id: opts.id,
      user: opts.user
    });
  },

  userStand(opts) {
    SeatDispatcher.dispatch({
      type: ActionTypes.USER_STAND,
      id: opts.id,
      user: opts.user
    });
  }

}

export default SeatActionCreators;