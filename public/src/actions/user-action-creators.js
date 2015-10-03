import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';

let UserActionCreators = {

  userJoined(user, external) {
    UserDispatcher.dispatch({
      type: ActionTypes.JOINED,
      user,
      external
    });
  },

  userLeft(user, external) {
    UserDispatcher.dispatch({
      type: ActionTypes.LEFT,
      user,
      external
    });
  },

  changeName(user, name, external) {
    UserDispatcher.dispatch({
      type: ActionTypes.CHANGE_NAME,
      user,
      name,
      external
    });
  }

}

export default UserActionCreators;