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
        <p style={{ fontSize: '2.4em' }}>You are signed out.</p>
        <br/><br/>
        <Button as={NavLink} exact to='/' color='teal' size='large'>Back to Home Page</Button>
      </Header>
    );
  }
}
