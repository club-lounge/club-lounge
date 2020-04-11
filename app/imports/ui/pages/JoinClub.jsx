import React from 'react';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Search, Grid, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Club from '../components/Club';
import { Clubs } from '../../api/club/Clubs';

const source = _.times(5, () => ({
  title: this.props.clubs.clubName,
  description: this.props.clubs.description,
  image: this.props.clubs.image,
}));

const initialState = { isLoading: false, results: [], value: '' };

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class JoinClub extends React.Component {
  state = initialState

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    // eslint-disable-next-line consistent-return
    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      });
    }, 300);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const { isLoading, value, results } = this.state;
    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>Join a Club</Header>
          <Card.Group>
            {this.props.clubs.map((club, index) => <Club
                key={index}
                club={club}/>)}
          </Card.Group>
          <Grid>
            <Grid.Column width={6}>
              <Search
                  fluid
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                  })}
                  results={results}
                  value={value}
                  {...this.props}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment>
                <Header>State</Header>
                <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(this.state, null, 2)}
            </pre>
                <Header>Options</Header>
                <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(source, null, 2)}
            </pre>
              </Segment>
            </Grid.Column>
          </Grid>
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
    clubs: Clubs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(JoinClub);
