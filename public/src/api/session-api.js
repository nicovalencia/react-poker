import reqwest from 'reqwest';

class SessionApi {

  bootstrap() {
    let token = localStorage.getItem('token');
    return reqwest({
      url: '/sessions',
      method: 'POST',
      data: { token }
    }).then((resp) => {
      return resp.session;
    });
  }

}

export default new SessionApi();