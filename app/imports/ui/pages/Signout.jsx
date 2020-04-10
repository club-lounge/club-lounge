import React from 'react';
import { Meteor } from 'meteor/meteor';
import { NavLink } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <Header as="h2" textAlign="center" inverted>
        You are signed out.
        <br/><br/><br/>
        <Button as={NavLink} exact to='/'>Back to Home Page</Button>
      </Header>
    );
  }
}
