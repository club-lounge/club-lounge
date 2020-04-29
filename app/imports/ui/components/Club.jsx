import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Members } from '../../api/members/Members';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Club extends React.Component {
  render() {
    const data = Members.findOne({ member: Meteor.user().username, club: this.props.club._id });

    return (this.props.ready) ? this.card(data) : ('');
  }

  card(data) {
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
            <Button.Group className='ui two buttons'>
              {data ? (<Button basic color='red' onClick={() => this.leave(data._id)}>
                Leave
              </Button>) : (<Button basic color='green' onClick={() => this.join(this.props.club._id)}>
                Join
              </Button>)}
              <Button basic color='grey' as={NavLink} exact to={`/clubinformation/${this.props.club._id}`}>
                More Info
              </Button>
            </Button.Group>
          </Card.Content>
        </Card>
    );
  }

  join(data) {
    Members.insert({
      member: Meteor.user().username, club: data,
    });
    swal({
      title: 'Joined!',
      text: `You are now part of: ${this.props.club.clubName}`,
      icon: 'success',
      button: 'Got it',
    });
  }

  leave(id) {
    Members.remove(id);
    swal({
      title: 'Left!',
      text: `You left the club: ${this.props.club.clubName}`,
      icon: 'warning',
      button: 'Got it',
    });
  }
}

/** Require a document to be passed to this component. */
Club.propTypes = {
  club: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
  member: PropTypes.array,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const subscription = Meteor.subscribe('Members');
  return {
    member: Members.find({ member: Meteor.user().username }).fetch(),
    ready: subscription.ready(),
  };
})(Club);
