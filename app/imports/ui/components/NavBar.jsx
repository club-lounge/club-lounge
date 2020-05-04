import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    return (
        <div>
          {this.props.currentUser !== '' ? (
              <Menu attached="top" borderless inverted secondary>
                <Menu.Item as={NavLink} activeClassName="" exact to="/">
                  <Header inverted as='h1'>Club Lounge</Header>
                </Menu.Item>
                {this.props.currentUser ? (
                    [<Menu.Item as={NavLink} activeClassName="active" exact to="/upcomingevents"
                                key='upcomingevents'>Upcoming Events</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active"
                                 exact to="/joinclub" key='joinclub'>Club List</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active"
                                 exact to="/create" key='create'>Create a Club</Menu.Item>]
                ) : ''}
                {Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
                      <Menu.Item as={NavLink} activeClassName="active"
                                 exact to="/requests" key='requests'>Approve(Admin)</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active"
                                 exact to="/registrants" key='registrants'>List of Registrants(Admin)</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active"
                                 exact to="/manage_tags" key="tags_manage">Event Tag(Admin)</Menu.Item>]
                ) : ''}
                <Menu.Item position="right">
                  <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
                    <Dropdown.Menu>
                      <Dropdown.Item icon="user" text="Profile" as={NavLink} exact to="/profile"/>
                      <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              </Menu>
          ) : ('')}
        </div>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
