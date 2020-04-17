import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Create from '../components/Create';
import { Creates } from '../../api/create/Creates';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class RequestsAdmin extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>Club Requests</Header>
          <Card.Group>
            {this.props.requests.map((create, index) => (create.approve == null ? (
                <Create
                    key={index}
                    create={create}/>
            ) : ('')))}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
RequestsAdmin.propTypes = {
  requests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Creates');
  return {
    requests: Creates.find({}).fetch(),
    ready: subscription.ready(),
  };
})(RequestsAdmin);
