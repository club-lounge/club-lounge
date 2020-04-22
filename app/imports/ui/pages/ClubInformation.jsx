import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubInfos from '../components/ClubInfos';
import { ClubInfo } from '../../api/club_info/ClubInfo';

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
          <Header as="h2" textAlign="center" inverted>Club Information</Header>
            {this.props.clubinfo.map((clubinfo, index) => <ClubInfos
                key={index}
                event={clubinfo}/>)}
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubInformation.propTypes = {
  clubinfo: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('ClubInfo');
  return {
    clubinfo: ClubInfo.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ClubInformation);
