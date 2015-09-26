import React from 'react';
import io from 'socket.io-client';

import Header from 'src/components/header';
import Clock from 'src/components/clock';
import Table from 'src/components/table';

let USER = {
  name: 'Nico Valencia',
  status: 'spectating'
};

const socket = io();

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <Clock />
        <Table player={USER} user={USER} />
      </div>
    );
  }
}

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);
