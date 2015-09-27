import React from 'react';
import _ from 'lodash';

import Seat from 'src/components/seat';
import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

function getStateFromStores() {
  return {
    user: UserStore.get()
  };
}

class Table extends React.Component {

  constructor(props) {
    super();
    this.state = Object.assign({
      status: 'Waiting for players to join...'
    }, getStateFromStores());
  }

  render() {

    let seats = _.map(SeatStore.getAll(), (seat) => {
      return (
        <Seat _id={seat.id} key={seat.id} />
      );
    });

    return (
      <div id="table">
        <h2>{this.state.status}</h2>
        {seats}
      </div>
    );
  }

}

export default Table;