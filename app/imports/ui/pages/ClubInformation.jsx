import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Image, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/club/Clubs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h1" textAlign="center" inverted>Club Information</Header>
          <Header as='h2' textAlign="center" inverted>{this.props.club.clubName}</Header>
          <Image centered src={this.props.club.image} size='medium'/>
          <Container textAlign="center">{this.props.club.description}</Container>
          <Container textAlign="center">{this.props.club.clubEmail}</Container>
          <Container textAlign="center">{this.props.club.clubWeb}</Container>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubInformation.propTypes = {
  club: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Clubs');
  return {
    club: Clubs.findOne(documentId),
    ready: subscription.ready(),
  };
})(ClubInformation);
