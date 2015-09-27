import React from 'react';
import io from 'socket.io-client';

import Header from 'src/components/header';
import Profile from 'src/components/profile';
import Clock from 'src/components/clock';
import Table from 'src/components/table';

const socket = io();

class App extends React.Component {

  render() {
    return (
      <div id="app">
        <Header />
        <Profile />
        <Clock />
        <Table />
      </div>
    );
  }

}

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);
