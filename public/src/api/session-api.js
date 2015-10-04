import reqwest from 'reqwest';

class SessionApi {

  bootstrap() {
    let token = localStorage.getItem('token');
    return reqwest({
      url: '/sessions',
      method: 'POST',
      data: { token }
    }).then((resp) => {
      localStorage.setItem('token', resp.session.token);

      // Eventually, when user can multi-table, they can choose a
      // table here, or perhaps open a window for each table.
      //
      // For now, just use the first table:
      localStorage.setItem('tableId', resp.session.tables[0]._id);

      return resp.session;
    });
  }

}

export default new SessionApi();