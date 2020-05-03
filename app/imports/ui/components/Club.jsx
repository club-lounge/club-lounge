import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Club extends React.Component {
  render() {
    return (this.props.ready) ? this.card() : ('');
  }

  card() {
    return (
        <Card centered>
          <Image wrapped src={this.props.club.image}/>
          <Card.Content>
            <Card.Header>{this.props.club.clubName}</Card.Header>
            <Card.Description>
              {this.props.club.description}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Button fluid basic color='grey' as={NavLink} exact to={`/clubinfo/${this.props.club._id}`}>
              More Info
            </Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Club.propTypes = {
  club: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const subscription = Meteor.subscribe('Members');
  return {
    ready: subscription.ready(),
  };
})(Club);
