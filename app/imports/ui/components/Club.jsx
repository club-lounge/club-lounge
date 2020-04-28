import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { Members } from '../../api/members/Members';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Club extends React.Component {
  render() {
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
              <Button basic color='green' onClick={() => this.joined(this.props.club._id)}>
                Join
              </Button>
              <Button basic color='grey' as={NavLink} exact to={`/clubinformation/${this.props.club._id}`}>
                More Info
              </Button>
            </Button.Group>
          </Card.Content>
        </Card>
    );
  }

  joined(data) {
    Members.insert({
      member: Meteor.user().username, club: data,
    });
  }
}

/** Require a document to be passed to this component. */
Club.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Club);
