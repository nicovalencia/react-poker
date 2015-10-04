import React from 'react';

import SessionApi from 'src/api/session-api';

import Header from 'src/components/header';
import Profile from 'src/components/profile';
import Clock from 'src/components/clock';
import Table from 'src/components/table';
import UserList from 'src/components/user-list';

import TableStore from 'src/stores/table-store';
import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

import Socket from 'src/socket';

// session:
SessionApi.bootstrap().then((session) => {

  let tableId = localStorage.getItem('tableId');

  new Socket(session.token, tableId);

  TableStore.bootstrap(tableId).then(() => {
    UserStore.bootstrap();
    SeatStore.bootstrap();
  });
});

class App extends React.Component {

  render() {
    return (
      <div id="app">
        <Header />
        <Profile />
        <Clock />
        <Table />
        <UserList />
      </div>
    );
  }

}

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);
