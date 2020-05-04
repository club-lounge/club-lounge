import React from 'react';
import { Segment, Image, Button, Grid, Header, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { Registrants } from '../../api/register/Registrants';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Event extends React.Component {
  render() {
    const now = new Date();
    let button = '';
    if (now <= this.props.event.end) {
      if (!this.props.is_member) {
        const onJoin = () => {
          Registrants.insert({ event: this.props.event._id, email: this.props.user });
          swal('I will go!', `You now part of the will go club of ${this.props.event.eventName}`, 'success');
        };
        button = <Button fluid onClick={onJoin} color='green'>Will Go</Button>;
      } else {
        const onLeave = () => {
          Registrants.remove(this.props.is_member._id);
          swal('Can\'t Make it...', 'It\'s ok, there is always next time!');
        };
        button = <Button fluid onClick={onLeave} color='red'>Can Not Make It</Button>;
      }
    }

    return (
        <Segment>
          <Grid>
            <Grid.Column width={2}>
              <Header as='h4' color='grey'>{this.props.event.clubName}</Header>
              <Image size='small' rounded src={this.props.event.image}/>
              <p>{this.props.event.start.toDateString()}</p>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as='h2'>{this.props.event.eventName}</Header>
              <p>{this.props.event.description}</p>
              <Divider/>
              <p>{this.props.event.location}</p>
            </Grid.Column>
            <Grid.Column width={3}>
              {button}
              <Button fluid color='grey' as={NavLink} exact to={`/eventinfo/${this.props.event._id}`}>
                More Info
              </Button>
            </Grid.Column>
          </Grid>
        </Segment>
    );
  }
}

/** Require a document to be passed to this component. */
Event.propTypes = {
  event: PropTypes.object.isRequired,
  is_member: PropTypes.object,
  user: PropTypes.string.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Event);
