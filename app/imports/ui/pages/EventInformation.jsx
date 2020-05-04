import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Header, Loader, Segment, Image, Container, Grid, Button, Table, Divider } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { Events } from '../../api/event/Events';
import { Clubs } from '../../api/club/Clubs';
import { Registrants } from '../../api/register/Registrants';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class EventInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const club = _.find(this.props.clubs, (e) => e._id === this.props.event.club);
    const will_go = _.filter(this.props.registrants, (e) => e.event === this.props.Id);
    const viewer = _.find(will_go, (e) => e.email === this.props.currentUser);
    const now = new Date();

    let button = '';
    if (now <= this.props.event.end) {
      if (!viewer) {
        const onJoin = () => {
          Registrants.insert({ event: this.props.event._id, email: this.props.currentUser });
          swal('I will go!', `You now part of the will go club of ${this.props.event.eventName}`, 'success');
        };
        button = <Button onClick={onJoin} floated='right' color='green'>Will Go</Button>;
      } else {
        const onLeave = () => {
          Registrants.remove(viewer._id);
          swal('Can\'t Make it...', 'It\'s ok, there is always next time!');
        };
        button = <Button onClick={onLeave} color='red' floated='right' >Can Not Make It</Button>;
      }
    }

    function reformat(e) {
      let ret = e.split('(');
      ret = ret.splice(0, ret.length - 1).join(' ');
      ret = ret.split(' ');
      ret = ret.splice(0, ret.length - 2).join(' ');
      ret = ret.split(':');
      ret = ret.splice(0, ret.length - 1).join(':');
      return ret;
    }

    const start = this.props.event.start;
    const end = this.props.event.end;
    let time = '';

    if (start.toDateString() !== end.toDateString()) {
      time = `start: ${start.toDateString()} ${reformat(start.toTimeString())}\n
      end: ${end.toDateString()} ${reformat(end.toTimeString())}`;
    } else {
      time = `${start.toDateString()} @ ${reformat(start.toTimeString())} - ${reformat(end.toTimeString())}`;
    }

    return (
        <Container>
          <Segment>
            <Header textAlign="center" as="h1">Event Information</Header>
            <Divider/>
            <Button as={NavLink} color='teal' exact to='/upcomingevents'>Back</Button>
            {button}
          </Segment>

          <Grid>
            <Grid.Column width={6}>
              <Segment>
                <Header textAlign="center" as="h2">{this.props.event.eventName}</Header>
                <Image src={this.props.event.image} />
                <Header as="h3">{club.clubName}</Header>
                <p>{this.props.event.description}</p>
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        Location
                      </Table.Cell>
                      <Table.Cell>
                        {this.props.event.location}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        Time
                      </Table.Cell>
                      <Table.Cell>
                        {time}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment>
                <Header as='h3' textAlign='center'>Participants</Header>
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
EventInformation.propTypes = {
  Id: PropTypes.string,
  currentUser: PropTypes.string,
  event: PropTypes.object,
  clubs: PropTypes.array.isRequired,
  registrants: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Events');
  const subscription1 = Meteor.subscribe('Registrants');
  const subscription2 = Meteor.subscribe('Clubs');
  return {
    Id: documentId,
    currentUser: Meteor.user() ? Meteor.user().username : '',
    event: Events.findOne(documentId),
    clubs: Clubs.find().fetch(),
    registrants: Registrants.find().fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready(),
  };
})(EventInformation);
