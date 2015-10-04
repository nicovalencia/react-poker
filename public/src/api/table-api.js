import {authReqwest} from 'src/api/api-helpers';

class TableApi {

  get(_id) {
    return authReqwest({
      url: `/tables/${_id}`,
      method: 'GET',
    }).then((resp) => {
      return resp.table;
    });
  }

}

export default new TableApi();