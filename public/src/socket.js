import io from 'socket.io-client';

import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

import UserActionCreators from 'src/actions/user-action-creators';
import SeatActionCreators from 'src/actions/seat-action-creators';

let socket = io();

socket.on('CHANGE_NAME', (resp) => {
  let user = UserStore.get(resp.id);
  UserActionCreators.changeName(user, resp.name, true);
});

socket.on('USER_SIT', (resp) => {
  let seat = SeatStore.get(resp.seat.id);
  let user = UserStore.get(resp.user.id);
  SeatActionCreators.userSit(seat, user, true);
});

socket.on('USER_STAND', (resp) => {
  let seat = SeatStore.get(resp.seat.id);
  let user = UserStore.get(resp.user.id);
  SeatActionCreators.userStand(seat, user, true);
});

export default socket;