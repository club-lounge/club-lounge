import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Loader, Card, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Club from '../components/Club';
import { Clubs } from '../../api/club/Clubs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class JoinClub extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
  }

  handleChange = (e, { value }) => this.setState({ search: value });

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  clubNameStart = (club) => {
    const { search } = this.state;
    return club.clubName.toLowerCase().startsWith(search.toLowerCase());
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const expectedSearch = _.map(this.props.clubs, function (input) {
      return input.clubName;
    });
    const result = _.sortBy(_.filter(this.props.clubs, this.clubNameStart), 'clubName');

    return (
        <Container>
          <Header as="h1" textAlign="center" inverted>Join a Club</Header>
          <div className='search bar'>
            <Input type='text' placeholder='Search for a Club...' icon='search' size='large' fluid
                   list='clubSearches' onChange={this.handleChange}/>
            <datalist id='clubSearches'>
              {expectedSearch.map((value, index) => <option value={value} key={index}/>)}
            </datalist>
          </div>
          <br/><br/><br/>
          <Card.Group>
            {result.length !== 0 ? result.map((club, index) => <Club
                key={index}
                club={club}/>) : <Header as='h2' inverted textAlign="center">No Result</Header>}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
JoinClub.propTypes = {
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find().fetch(),
    ready: subscription.ready(),
  };
})(JoinClub);
