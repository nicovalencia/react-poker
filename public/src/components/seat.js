import React from 'react';

import SeatActionCreators from 'src/actions/seat-action-creators';
import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

function getStateFromStores(props) {
  return {
    user: UserStore.getUser(),
    seat: SeatStore.get(props._id)
  };
}

class Seat extends React.Component {

  constructor(props) {
    super();
    this.state = getStateFromStores(props);
  }

  sit() {
    SeatActionCreators.playerSit({
      id: this.props._id,
      player: this.state.user
    });
  }

  stand() {
    SeatActionCreators.playerStand(this.props._id);
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
    SeatStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
    SeatStore.addChangeListener(this._onChange.bind(this));
  }

  render() {

    let actionButton;

    if (this.state.seat.player === this.state.user) {
      // user is sitting at this seat:
      actionButton = (
        <button type="button" onClick={this.stand.bind(this)}>Stand Up</button>
      );
    } else if (!SeatStore.isPlayerSitting(this.state.user)) {
      // user is not sitting in any seats:
      actionButton = (
        <button type="button" onClick={this.sit.bind(this)}>Sit Here</button>
      );
    }

    return (
      <div>
        <span>Seat {this.props._id}: {this.state.seat.player ? this.state.seat.player.name : 'EMPTY'}</span>
        {actionButton}
      </div>
    );
  }

  _onChange() {
    this.setState(getStateFromStores(this.props));
  }

}

export default Seat;