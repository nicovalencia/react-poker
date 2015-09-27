import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';

let UserActionCreators = {

  changeName(name) {
    UserDispatcher.dispatch({
      type: ActionTypes.CHANGE_NAME,
      name: name
    });
  }

}

export default UserActionCreators;