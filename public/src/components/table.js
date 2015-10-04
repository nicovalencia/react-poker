import React from 'react';
import _ from 'lodash';

import Seat from 'src/components/seat';
import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

function getStateFromStores() {
  return {
    seats: SeatStore.getAll()
  };
}

class Table extends React.Component {

  constructor(props) {
    super();
    this.state = Object.assign({
      status: 'Waiting for players to join...'
    }, getStateFromStores());
  }

  componentDidMount() {
    SeatStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    SeatStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {

    let seats = _.map(this.state.seats, (seat) => {
      return (
        <Seat _id={seat._id} key={seat._id} />
      );
    });

    return (
      <div id="table">
        <h2>{this.state.status}</h2>
        {seats}
      </div>
    );
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

}

export default Table;