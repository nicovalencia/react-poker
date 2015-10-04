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

}

export default new UserApi();