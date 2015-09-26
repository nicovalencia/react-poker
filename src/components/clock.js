import React from 'react';

class Clock extends React.Component {

	constructor() {
    super();
    this.state = this.getTimeData();
	}

  getTimeData() {
    let dt = new Date();
    let hours = dt.getHours() % 12;
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();
    let ampm = hours > 12 ? 'AM' : 'PM';

    if (hours === 0) {
      hours = 12;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return { hours, minutes, seconds, ampm };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(this.getTimeData());
    }, 1000);
  }

  render() {
    return (
      <span>{this.state.hours}:{this.state.minutes}:{this.state.seconds} {this.state.ampm}</span>
    );
  }

}

export default Clock;