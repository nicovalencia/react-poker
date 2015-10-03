import {authReqwest} from 'src/api/api-helpers';

class SeatApi {

  getAll() {
    return authReqwest({
      url: '/seats',
      method: 'GET'
    }).then((resp) => {
      return resp.seats;
    });
  }

  sitInSeat(seat) {
  	return authReqwest({
  		url: '/sitInSeat',
  		method: 'POST',
      data: { seat }
  	}).then((resp) => {
      return resp;
    });
  }

  standUpFromSeat(seat) {
    return authReqwest({
      url: '/standUpFromSeat',
      method: 'POST',
      data: { seat }
    }).then((resp) => {
      return resp;
    });
  }

}

export default new SeatApi();