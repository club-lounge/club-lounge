import React from 'react';
import { Meteor } from 'meteor/meteor';
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
    return (
        <div>
          <Container>
            <Segment>
              <Header as="h1" textAlign="center">Profile</Header>
            </Segment>
            <Grid>
              <Grid.Column width={5}>
                <Segment textAlign='center'>
                  <Image centered src={this.props.profile.image} size='medium'/>
                  <Header as='h2'>{this.props.profile.firstName} {this.props.profile.lastName}</Header>
                  <p>Email: {this.props.profile._id}</p>
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
  profile: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const subscription = Meteor.subscribe('Profiles');
  return {
    profile: Profiles.find({}).fetch(),
    ready: subscription.ready(),
  };
})(Profile);
