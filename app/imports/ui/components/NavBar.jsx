import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Image } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profile/Profiles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  readyCheck() {
    return (this.props.ready ? this.navBar() : '');
  }

  navBar() {
    let text = 'Unknown';
    let display;
    let width = 0;

    if (this.props.profile) {
      width = 4;
      text = `${this.props.profile.firstName} ${this.props.profile.lastName}`;
      display = (
          <span>
            <Image avatar src={this.props.profile.image}/> {text}
          </span>
      );
    }

    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      width = 6;
    }

    return (
        <div>
          <Menu attached="top" borderless inverted secondary>
            <Menu.Item as={NavLink} activeClassName="" exact to="/">
              <Header inverted as='h1'>Club Lounge</Header>
            </Menu.Item>
            <Menu.Item as={NavLink} activeClassName="active" exact to="/upcomingevents"
                       key='upcomingevents'>Upcoming Events</Menu.Item>
            <Menu.Item as={NavLink} activeClassName="active"
                       exact to="/joinclub" key='joinclub'>Club List</Menu.Item>
            <Menu.Item as={NavLink} activeClassName="active"
                       exact to="/create" key='create'>Club Page Request</Menu.Item>
            {width === 6 ? ([
                  <Menu.Item as={NavLink} activeClassName="active"
                             exact to="/requests" key='requests'>Approve(Admin)</Menu.Item>,
                  <Menu.Item as={NavLink} activeClassName="active"
                             exact to="/manage_tags" key="tags_manage">Event Tag(Admin)</Menu.Item>]
            ) : ''}
            <Menu.Item position="right">
              <Dropdown pointing="top right" icon='triangle down' fluid trigger={display}>
                <Dropdown.Menu>
                  <Dropdown.Item disabled>{this.props.currentUser}</Dropdown.Item>
                  <Dropdown.Item icon="user circle" text="Profile" as={NavLink} exact to="/profile"/>
                  <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </div>
    );
  }

  render() {
    return (
        this.props.currentUser === '' ? ('') : this.readyCheck()
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
  profile: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const current = Meteor.user() ? Meteor.user().username : '';
  const sub = Meteor.subscribe('Profiles');
  return {
    currentUser: current,
    profile: Profiles.findOne(current),
    ready: sub.ready(),
  };
})(NavBar);
