import io from 'socket.io-client';

import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

import UserActionCreators from 'src/actions/user-action-creators';
import SeatActionCreators from 'src/actions/seat-action-creators';

class Socket {

  constructor(token) {
    this.io = io();

    // authenticate socket:
    this.io.on('connect', () => {
      this.io.emit('AUTHENTICATE', token);
    });

    this.bindEvents();
  }

  bindEvents() {

    this.io.on('CLIENT_JOINED', (resp) => {
      console.log('New user joined. Identifying...');
    });

    this.io.on('CLIENT_IDENTIFIED', (resp) => {
      console.log(`New user identified as: ${resp.user.name}`);
      UserActionCreators.userJoined(resp.user, true);
    });

    this.io.on('CLIENT_LEFT', (resp) => {
      console.log(`${resp.user.name} has left`);
      UserActionCreators.userLeft(resp.user, true);
    });

    this.io.on('CHANGE_NAME', (resp) => {
      let user = UserStore.get(resp.id);
      UserActionCreators.changeName(user, resp.name, true);
    });

    this.io.on('USER_SIT', (resp) => {
      let seat = SeatStore.get(resp.seat.id);
      let user = UserStore.get(resp.user.id);
      SeatActionCreators.userSit(seat, user, true);
    });

    this.io.on('USER_STAND', (resp) => {
      let seat = SeatStore.get(resp.seat.id);
      let user = UserStore.get(resp.user.id);
      SeatActionCreators.userStand(seat, user, true);
    });

  }

}

export default Socket;