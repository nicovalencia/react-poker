import SeatDispatcher from 'src/dispatchers/seat-dispatcher';
import ActionTypes from 'src/constants/seat-constants';

let SeatActionCreators = {

  userSit(seat, user, external) {
    SeatDispatcher.dispatch({
      type: ActionTypes.USER_SIT,
      seat,
      user,
      external
    });
  },

  userStand(seat, user, external) {
    SeatDispatcher.dispatch({
      type: ActionTypes.USER_STAND,
      seat,
      user,
      external
    });
  }

}

export default SeatActionCreators;