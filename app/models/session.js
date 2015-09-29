import _ from 'lodash';

let _sessions = [];
let userIdCounter = 1;

class Session {

  create() {
    let session = {
      token: `${_.random(1e10)}-${_.random(1e10)}-${_.random(1e10)}`,
      user: {
        id: userIdCounter,
        name: `New Player ${userIdCounter}`
      }
    };
    userIdCounter++;
    _sessions.push(session);
    return session;
  }

  find(attrs) {
    return _.find(_sessions, attrs);
  }

  findOrCreate(attrs) {
    return this.find(attrs) || this.create();
  }

  getAll() {
    return _sessions;
  }

}

export default new Session();