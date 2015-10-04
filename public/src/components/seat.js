import React from 'react';

import SeatActionCreators from 'src/actions/seat-action-creators';
import UserStore from 'src/stores/user-store';
import SeatStore from 'src/stores/seat-store';

function getStateFromStores(props) {
  return {
    currentUser: UserStore.getCurrentUser(),
    seat: SeatStore.get(props._id)
  };
}

class Seat extends React.Component {

  constructor(props) {
    super();
    this.state = getStateFromStores(props);
  }

  sit() {
    let seat = this.state.seat;
    let user = this.state.currentUser;
    SeatActionCreators.userSit(seat, user);
  }

  stand() {
    let seat = this.state.seat;
    let user = this.state.currentUser;
    SeatActionCreators.userStand(seat, user);
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

    if (
      this.state.seat.user &&
      this.state.seat.user._id === this.state.currentUser._id
    ) {

      // current user is sitting at this seat:
      actionButton = (
        <button type="button" onClick={this.stand.bind(this)}>Stand Up</button>
      );

    } else if (
      !this.state.seat.user &&
      !SeatStore.isUserSitting(this.state.currentUser)
    ) {
      
      // seat is empty and...
      // current user is standing up
      actionButton = (
        <button type="button" onClick={this.sit.bind(this)}>Sit Here</button>
      );

    }

    return (
      <div>
        <span>Seat {this.props._id}: {this.state.seat.user ? this.state.seat.user.name : 'EMPTY'}</span>
        {actionButton}
      </div>
    );
  }

  _onChange() {
    this.setState(getStateFromStores(this.props));
  }

}

export default Seat;