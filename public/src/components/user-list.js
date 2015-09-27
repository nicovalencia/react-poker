import React from 'react';
import _ from 'lodash';

import UserStore from 'src/stores/user-store';

function getStateFromStores() {
  return {
    users: UserStore.getAll()
  };
}

class UserList extends React.Component {

  constructor() {
    super();
    this.state = getStateFromStores();
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
  }

	render() {

    let list;
    if (this.state.users.length) {
      list = _.map(this.state.users, (user) => {
        return <li>{user.name}</li>;
      });
    } else {
      list = <li>Loading users...</li>;
    }

    return (
      <section>
        <h3>User List:</h3>
        <ul>{list}</ul>
      </section>
    );
	}

  _onChange() {
    this.setState(getStateFromStores());
  }

}

export default UserList;