import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';
import EventEmitter from 'events';
import _ from 'lodash';

import UserApi from 'src/api/user-api';
import TableStore from 'src/stores/table-store';

const CHANGE_EVENT = 'change';

let _users = [];
let _currentUserId = null;

function _addUser(action) {
  let currentUser = userStoreInstance.getCurrentUser();

  if (currentUser._id !== action.user._id) {
    userStoreInstance.addUser(action.user);
  }
}

function _removeUser(action) {
  let currentUser = userStoreInstance.getCurrentUser();

  if (currentUser._id === action.user._id) {
    // user left from another browser or was booted:
    location.reload();
  } else {
    userStoreInstance.removeUser(action.user);
  }
}

function _changeName(action) {
  let currentUser = userStoreInstance.getCurrentUser();

  if (currentUser.id === action.user.id) {
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
      _currentUserId = user._id;
      this.emitChange();
    });

    // load _users:
    _users = TableStore.getCurrent().users;
    this.emitChange();
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
    return _.find(_users, { _id }) || {
      name: 'Loading User...'
    };
  }

  getCurrentUser() {
    return this.get(_currentUserId);
  }

  getAll() {
    return _users;
  }

  addUser(attrs) {
    let user = _.find(_users, attrs);
    if (user) {
      Object.assign(user, attrs);
    } else {
      _users.push(attrs);
    }
    this.emitChange();
  }

  removeUser(attrs) {
    _.remove(_users, attrs);
    this.emitChange();
  }

}

let userStoreInstance = new UserStore();
userStoreInstance.setMaxListeners(20);
userStoreInstance.dispatchToken = UserDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.JOINED:
      _addUser(action);
      userStoreInstance.emitChange();
      break;

    case ActionTypes.LEFT:
      _removeUser(action);
      userStoreInstance.emitChange();
      break;

    case ActionTypes.CHANGE_NAME:
      _changeName(action);
      userStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default userStoreInstance;