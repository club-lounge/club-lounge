import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Clubs } from '../../api/club/Clubs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubInfos extends React.Component {
  render() {
    return (
        <Container text>
          <Header as='h2' textAlign="center" inverted>{this.props.clubinfo.clubName}</Header>
          <Image centered>{this.props.clubinfo.image}</Image>
          <p>{this.props.clubinfo.description}</p>
        </Container>
    );
  }
}

/** Require a document to be passed to this component. */
ClubInfos.propTypes = {
  clubinfo: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('ClubInformation');
  return {
    clubinfo: Clubs.findOne(documentId),
    ready: subscription.ready(),
  };
})(ClubInfos);
