import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Segment, Container, Header, Image, Loader, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Profiles } from '../../api/profile/Profiles';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Profile extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const data = _.find(this.props.profiles, (input) => {
      return input._id === Meteor.user().username;
    });

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
                  <p>Clubs they joined and events they registered posts here</p>
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
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('Profiles');
  return {
    profiles: Profiles.find().fetch(),
    ready: subscription.ready(),
  };
})(Profile);
