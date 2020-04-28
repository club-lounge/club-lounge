import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Segment, Container, Header, Image, Loader, Grid, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Clubs } from '../../api/club/Clubs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  linkProcess(link) {
    if (link.toLowerCase().startsWith('http')) {
      return link;
    }
    return `https://${link}`;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div>
          <Container>
            <Segment>
              <Header as="h1" textAlign="center">Club Information</Header>
            </Segment>
            <Grid>
              <Grid.Column width={5}>
                <Segment textAlign='center'>
                  <Header as='h2'>{this.props.club.clubName}</Header>
                  <Image centered src={this.props.club.image} size='medium'/>
                  <p>{this.props.club.description}</p>
                  <a href={this.linkProcess(this.props.club.clubWeb)}><p>{this.props.club.clubWeb}</p></a>
                  <p>{this.props.club.clubEmail}</p>
                </Segment>
                <Button as={NavLink} floated='left' color='teal' exact to='/joinclub'>Back</Button>
              </Grid.Column>
              <Grid.Column width={11}>
                <Segment>
                  <p>Club upcoming event goes here</p>
                </Segment>
              </Grid.Column>
            </Grid>
          </Container>
        </div>
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
