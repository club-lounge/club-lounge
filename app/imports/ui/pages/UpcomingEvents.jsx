import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Loader, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Event from '../components/Event';
import { Events } from '../../api/event/Events';
import { Clubs } from '../../api/club/Clubs';
import { Registrants } from '../../api/register/Registrants';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class UpcomingEvents extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const now = new Date();
    const isIn = _.filter(this.props.registrants, (e) => e.email === this.props.currentUser);
    let renderData = _.filter(this.props.events, (e) => e.end >= now);
    renderData = _.map(renderData, (e) => {
      e.clubName = (_.find(this.props.clubs, (input) => e.club === input._id)).clubName;
      return e;
    });
    renderData = _.sortBy(renderData, ['start']);

    return (
        <Container>
          <Header as="h1" textAlign="center" inverted>Upcoming Events</Header>
          <Segment.Group raised>
            {renderData.map((event, index) => <Event
                key={index} event={event} user={this.props.currentUser}
                is_member={(_.find(isIn, (input) => input.event === event._id))} />)}
          </Segment.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
UpcomingEvents.propTypes = {
  currentUser: PropTypes.string,
  events: PropTypes.array.isRequired,
  clubs: PropTypes.array.isRequired,
  registrants: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Events');
  const subscription2 = Meteor.subscribe('Clubs');
  const subscription3 = Meteor.subscribe('Registrants');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    events: Events.find({}).fetch(),
    clubs: Clubs.find().fetch(),
    registrants: Registrants.find().fetch(),
    ready: subscription.ready() && subscription2.ready() && subscription3.ready(),
  };
})(UpcomingEvents);
