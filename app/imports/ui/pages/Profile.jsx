import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Segment, Container, Header, Image, Loader, Grid, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { Profiles } from '../../api/profile/Profiles';
import { Events } from '../../api/event/Events';
import Event from '../components/Event';
import { Clubs } from '../../api/club/Clubs';
import Club from '../components/Club';
import { Members } from '../../api/members/Members';
import { Registrants } from '../../api/register/Registrants';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Profile extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting Your Profile...</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const data = this.props.profile;

    const club = _.filter(this.props.clubs, (e) => _.contains(_.pluck(this.props.members, 'club'), e._id));
    const event = _.filter(this.props.events, (e) => _.contains(_.pluck(this.props.register, 'event'), e._id));

    if (data) {
      return (
          <div>
            <Container>
              <Segment>
                <Header as="h1" textAlign="center">Profile</Header>
              </Segment>
              <Grid>
                <Grid.Column width={5}>
                  <Segment textAlign='center'>
                    <Image centered src={data.image} size='medium'/>
                    <Header as='h2'>{data.firstName} {data.lastName}</Header>
                    <p>Email: {data._id}</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={11}>
                  <Segment>
                    <Header as='h3'>Clubs you are in</Header>
                      <Card.Group>
                      {club.map((e, index) => <Club key={index} club={e}/>)}
                      </Card.Group>
                    <Header as='h3'>Events you registered</Header>
                    <Segment.Group>
                      {event.map((e, index) => <Event key={index} event={e} user={this.props.current}
                                                      is_member={_.find(this.props.register,
                                                          (input) => input.event === e._id)}/>)}
                    </Segment.Group>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Container>
          </div>
      );
    }

    return (
        <Header as="h3" inverted textAlign='center'>Unknown Error Has Occurred</Header>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Profile.propTypes = {
  profile: PropTypes.object,
  current: PropTypes.string.isRequired,
  clubs: PropTypes.array,
  events: PropTypes.array,
  members: PropTypes.array,
  register: PropTypes.array,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const sub = Meteor.subscribe('Profiles');
  const subs2 = Meteor.subscribe('Clubs');
  const subs3 = Meteor.subscribe('Events');
  const subs4 = Meteor.subscribe('Members');
  const sub1 = Meteor.subscribe('Registrant');

  const target = Meteor.user() ? Meteor.user().username : '';

  return {
    current: target,
    profile: Profiles.findOne(target),
    register: Registrants.find().fetch(),
    clubs: Clubs.find().fetch(),
    events: Events.find().fetch(),
    members: Members.find({ member: target }).fetch(),
    ready: sub.ready() && sub1.ready() && subs2.ready() && subs3.ready() && subs4.ready(),
  };
})(Profile);
