import React from 'react';
import UserActionCreators from 'src/actions/user-action-creators';
import UserStore from 'src/stores/user-store';

function getStateFromStores() {
  return {
    user: UserStore.getCurrentUser()
  };
}

class Profile extends React.Component {

	constructor(props) {
		super()
    this.state = getStateFromStores();
	}

  edit(event) {
    event.preventDefault();
    this.setState({
      isEditing: true
    });
  }

  save(event) {
    event.preventDefault();
    this.setState({
      isEditing: false
    });
    let user = UserStore.getCurrentUser();
    UserActionCreators.changeName(user, event.target.name.value);
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {

    let action;
    let actionHandler;
    let nameElement;

    if (this.state.isEditing) {
      action = 'Save';
      actionHandler = this.save.bind(this);
      nameElement = (
        <input type="text" name="name" defaultValue={this.state.user.name} />
      );
    } else if (this.state.user) {
      action = 'Edit';
      actionHandler = this.edit.bind(this);
      nameElement = (
        <h2>{this.state.user.name}</h2>
      );
    }

    return (
      <section>
        <form onSubmit={actionHandler}>
          {nameElement}
          <button type="submit">{action}</button>
        </form>
      </section>
    );
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

}

export default Profile;