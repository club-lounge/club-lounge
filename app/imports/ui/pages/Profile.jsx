import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Segment, Container, Header, Image, Loader, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Profiles } from '../../api/profile/Profiles';
import { Clubs } from '../../api/club/Clubs';
import Club from '../components/Club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Profile extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const data = _.find(this.props.profiles, (input) => input._id === Meteor.user().username);
    const result = _.filter(this.props.clubs, (e) => _.contains(data, e._id));

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
                  <Header as='h2'>History</Header>
                  <p>{result.map((club, index) => <Club key={index} club={club}/>)}</p>
                </Segment>
              </Grid.Column>
            </Grid>
          </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Profile.propTypes = {
  profiles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  clubs: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('Profiles');
  return {
    profiles: Profiles.find().fetch(),
    ready: subscription.ready(),
    clubs: Clubs.find().fetch(),
  };
})(Profile);
