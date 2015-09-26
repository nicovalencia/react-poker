import React from 'react';
import _ from 'lodash';

import Seat from 'src/components/seat';

class Table extends React.Component {

  constructor(props) {
    super();

    this.state = {
      status: 'Waiting for players to join...',
      player: props.player,
      players: []
    };
  }

  sitAtSeat(seatNumber) {
    if (_.contains(this.state.players, this.props.user)) {
      return console.warn('User is already sitting at a seat!');
    }

    this.props.player.status = 'sitting';

    this.state.players[seatNumber - 1] = this.props.player;
    this.setState({
      players: this.state.players
    });
  }

  leaveSeat() {
    let players = _.clone(this.state.players);
    let playerIndex = _.indexOf(this.state.players, this.props.user);
    delete players[playerIndex];

    this.props.player.status = 'spectating';

    this.setState({
      players: players
    });
  }

  render() {

    let seats = _.times(6, (i) => {
      var player = this.state.players[i];
      return (
        <Seat
          user={this.props.user}
          number={i+1}
          onSit={this.sitAtSeat.bind(this)}
          onLeave={this.leaveSeat.bind(this)}
          key={player}
          player={player} />
      );
    });

    return (
      <div id="table">
        <h2>{this.state.status} [{this.state.player.status}]</h2>
        {seats}
      </div>
    );
  }

}

export default Table;