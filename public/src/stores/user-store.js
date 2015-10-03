import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';
import EventEmitter from 'events';
import _ from 'lodash';

import UserApi from 'src/api/user-api';

const CHANGE_EVENT = 'change';

let _users = [];
let _currentUserId = null;

function _changeName(action) {
  let currentUser = userStoreInstance.getCurrentUser();

  if (currentUser === action.user) {
    console.log(`You changed your name to ${action.name}`);

    if (!action.external)
      UserApi.changeName(action.name);
  } else {
    console.log(`${action.user.name} changed their name to ${action.name}`);
  }

  action.user.name = action.name;
}

class UserStore extends EventEmitter {

  bootstrap() {
    // load _currentUserId:
    UserApi.getCurrent().then((user) => {
      _currentUserId = user.id;
      this.emitChange();
    });

    // load _users:
    UserApi.getAll().then((users) => {
      _users = users;
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
    return _.find(_users, { id: id }) || {
      name: 'Loading User...'
    };
  }

  getCurrentUser() {
    return this.get(_currentUserId);
  }

  getAll() {
    return _users;
  }

}

let userStoreInstance = new UserStore();

userStoreInstance.dispatchToken = UserDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CHANGE_NAME:
      _changeName(action);
      userStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default userStoreInstance;