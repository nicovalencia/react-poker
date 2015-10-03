import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';

let UserActionCreators = {

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