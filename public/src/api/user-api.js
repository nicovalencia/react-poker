import {authReqwest} from 'src/api/api-helpers';

class UserApi {

  changeName(name) {
    return authReqwest({
      url: '/changeName',
      method: 'POST',
      data: { name }
    }).then((resp) => {
      return resp.user;
    });
  }

  getCurrent() {
    return authReqwest({
      url: '/user',
      method: 'GET',
    }).then((resp) => {
      return resp.user;
    });
  }

  getAll() {
    return authReqwest({
      url: '/users',
      method: 'GET',
    }).then((resp) => {
      return resp.users;
    });
  }

}

export default new UserApi();