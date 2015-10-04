import {authReqwest} from 'src/api/api-helpers';

class SeatApi {

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