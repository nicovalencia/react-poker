import React from 'react';

import SessionApi from 'src/api/session-api';

import Header from 'src/components/header';
import Profile from 'src/components/profile';
import Clock from 'src/components/clock';
import Table from 'src/components/table';
import UserList from 'src/components/user-list';

import UserStore from 'src/stores/user-store';

// session:
SessionApi.bootstrap().then((session) => {
  localStorage.setItem('token', session.token);
  UserStore.bootstrap();
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
