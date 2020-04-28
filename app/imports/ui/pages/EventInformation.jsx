import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Loader, Segment, Image, Container, Grid, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Events } from '../../api/event/Events';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class EventInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Segment>
            <Header textAlign="center" as="h1">Event Information</Header>
          </Segment>

          <Grid>
            <Grid.Column width={5}>
              <Segment>
                <Header textAlign="center" as="h2">{this.props.event.eventName}</Header>
                <Image src={this.props.event.image} size='medium'/>
                <Header as="h3">{this.props.event.clubName}</Header>
                <p>{this.props.event.description}</p>
                <p>{this.props.event.location}</p>
                <p>{this.props.event.date} {this.props.event.time}</p>
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>
              <Segment>
                <p>Maybe an additional information about the event, like what is expected and such</p>
                <Button as={NavLink} exact to={`/register/${this.props.event._id}`}>Register</Button>
                <Button as={NavLink} floated='right' color='teal' exact to='/upcomingevents'>Back</Button>
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
EventInformation.propTypes = {
  event: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Events');
  return {
    event: Events.findOne(documentId),
    ready: subscription.ready(),
  };
})(EventInformation);
