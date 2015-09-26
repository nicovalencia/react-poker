import React from 'react';

class Seat extends React.Component {

  constructor(props) {
    super();

    this.state = {
      player: props.player
    };
  }

  sitHere() {
    this.props.onSit(this.props.number);
  }

  leave() {
    this.props.onLeave();
  }

  render() {

    let actionButton;

    if (this.state.player === this.props.user) {
      actionButton = (
        <button type="button" onClick={this.leave.bind(this)}>Leave</button>
      );
    } else if (this.props.user.status !== 'sitting') {
      actionButton = (
        <button type="button" onClick={this.sitHere.bind(this)}>Sit Here</button>
      );
    }

    return (
      <div>
        <span>Seat {this.props.number}: {this.state.player ? this.state.player.name : 'EMPTY'}</span>
        {actionButton}
      </div>
    );
  }

}

export default Seat;