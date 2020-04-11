import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    return (
      <Header as="h2" textAlign="center" inverted>
        <p style={{ fontSize: '2.4em' }}>Page not found</p>
        <br/>
        <Button as={NavLink} exact to='/' color='teal' size='large'>Back to Home Page</Button>
      </Header>
    );
  }
}

export default NotFound;
