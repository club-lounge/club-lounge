import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Loader, Segment, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Event from '../components/Event';
import { Events } from '../../api/event/Events';
import { Clubs } from '../../api/club/Clubs';
import { Registrants } from '../../api/register/Registrants';
import { Tags } from '../../api/tag/Tags';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: [] };
  }

  handleChange = (e, { value }) => {
    this.setState({ value });
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const total = _.map(this.props.tags, (e) => ({ key: e._id, text: e._id, value: e._id }));
    const target = this.state.value;

    const now = new Date();
    const isIn = _.filter(this.props.registrants, (e) => e.email === this.props.currentUser);

    function tagCheck(e) {
      let ret = true;
      for (let i = 0; i < target.length; i++) {
        ret = _.contains(e.tags, target[i]);
        if (!ret) {
          return ret;
        }
      }
      return ret;
    }

    let renderData = _.filter(this.props.events, (e) => e.end >= now);
    renderData = _.filter(renderData, tagCheck);
    renderData = _.map(renderData, (e) => {
      e.clubName = (_.find(this.props.clubs, (input) => e.club === input._id)).clubName;
      return e;
    });
    renderData = _.sortBy(renderData, ['start']);

    const eventCard = renderData.map((event, index) => <Event
        key={index} event={event} user={this.props.currentUser}
        is_member={(_.find(isIn, (input) => input.event === event._id))} />);

    return (
        <Container>
          <Header as="h1" textAlign="center" inverted>Upcoming Events</Header>
          <br/>
          <Dropdown placeholder='Tag Search' fluid multiple selection options={total} onChange={this.handleChange}/>
          <br/>
          <Segment.Group raised>
            {renderData.length === 0 ? (<Header inverted as='h2' textAlign='center'>No Result</Header>) : (eventCard)}
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
  tags: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Events');
  const subscription1 = Meteor.subscribe('Tags');
  const subscription2 = Meteor.subscribe('Clubs');
  const subscription3 = Meteor.subscribe('Registrants');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    tags: Tags.find().fetch(),
    events: Events.find({}).fetch(),
    clubs: Clubs.find().fetch(),
    registrants: Registrants.find().fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(UpcomingEvents);
