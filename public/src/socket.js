import io from 'socket.io-client';

import UserStore from 'src/stores/user-store';
import UserActionCreators from 'src/actions/user-action-creators';

let socket = io();

socket.on('CHANGE_NAME', (resp) => {
  let user = UserStore.get(resp.id);
  UserActionCreators.changeName(user, resp.name, true);
});

export default socket;