import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Event extends React.Component {
  render() {
    return (
        <Card centered>
          <Image wrapped src={this.props.event.image}/>
          <Card.Content>
            <Card.Header>{this.props.event.eventName}</Card.Header>
            <Card.Meta>{this.props.event.clubName}</Card.Meta>
            <Card.Description>
              {this.props.event.description}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <div className='ui two buttons'>
                <Button as={NavLink} exact to={`/register/${this.props.event._id}`} basic color='green'>
                  Register
                </Button>
              <Button basic color='grey' as={NavLink} exact to={`/eventinformation/${this.props.event._id}`}>
                More Info
              </Button>
            </div>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  event: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
