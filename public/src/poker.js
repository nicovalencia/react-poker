import React from 'react';
import request from 'superagent';

import Header from 'src/components/header';
import Profile from 'src/components/profile';
import Clock from 'src/components/clock';
import Table from 'src/components/table';
import UserList from 'src/components/user-list';

import UserStore from 'src/stores/user-store';

// basic auth:
let token = localStorage.getItem('token');
request
  .post('/sessions')
  .send({ token })
  .set('Accept', 'application/json')
  .end((err, resp) => {
    localStorage.setItem('token', resp.body.session.token);
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
