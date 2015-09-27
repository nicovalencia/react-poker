import UserDispatcher from 'src/dispatchers/user-dispatcher';
import ActionTypes from 'src/constants/user-constants';
import EventEmitter from 'events';
import request from 'superagent';
import _ from 'lodash';

const CHANGE_EVENT = 'change';

let _users = [];
let _userId = null;

function _setName(name) {
  request
    .post('/changeName')
    .set('X-TOKEN', localStorage.getItem('token'))
    .send({
      name: name
    })
    .end();
  let user = userStoreInstance.getUser();
  user.name = name;
}

class UserStore extends EventEmitter {

  bootstrap() {
    // load _userId:
    request
      .get('/user')
      .set('X-TOKEN', localStorage.getItem('token'))
      .end((err, resp) => {
        _userId = resp.body.user.id;
        this.emitChange();
      });

    // load _users:
    request
      .get('/users')
      .end((err, resp) => {
        _users = resp.body.users;
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

  getUser() {
    return this.get(_userId);
  }

  getAll() {
    return _users;
  }

}

let userStoreInstance = new UserStore();

userStoreInstance.dispatchToken = UserDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CHANGE_NAME:
      _setName(action.name);
      userStoreInstance.emitChange();
      break;

    default:
      // do nothing
  }

});

export default userStoreInstance;