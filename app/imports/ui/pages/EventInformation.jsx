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
import { Profiles } from '../../api/profile/Profiles';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class EventInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const club = _.find(this.props.clubs, (e) => e._id === this.props.event.club);
    const viewer = _.find(this.props.registrants, (e) => e.email === this.props.currentUser);
    const participants = _.filter(this.props.profiles, (e) => _.find(this.props.registrants, (i) => e._id === i.email));
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
        button = <Button onClick={onLeave} color='red' floated='right'>Can Not Make It</Button>;
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
      time = [(
          <Table.Row key='before'>
            <Table.Cell>
              Before
            </Table.Cell>
            <Table.Cell>
              `${start.toDateString()} ${reformat(start.toTimeString())}`
            </Table.Cell>
          </Table.Row>), (
          <Table.Row key='after'>
            <Table.Cell>
              After
            </Table.Cell>
            <Table.Cell>
              `${end.toDateString()} ${reformat(end.toTimeString())}`
            </Table.Cell>
          </Table.Row>
      )];
    } else {
      time = (
          <Table.Row>
            <Table.Cell>
              Time
            </Table.Cell>
            <Table.Cell>
              `${start.toDateString()} @ ${reformat(start.toTimeString())} - ${reformat(end.toTimeString())}`
            </Table.Cell>
          </Table.Row>
      );
    }

    function converter(e, index) {
      return (
          <Segment key={index}>
            <Grid>
              <Grid.Column width={13}>
                <Header as='h3'>{`${e.firstName} ${e.lastName}`}</Header>
              </Grid.Column>
              <Grid.Column width={3}>
                <Image size='tiny' rounded src={e.image}/>
              </Grid.Column>
            </Grid>
          </Segment>
      );
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
                <Image src={this.props.event.image}/>
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
                    {time}
                  </Table.Body>
                </Table>

              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment.Group raised>
                <Segment><Header as='h2' textAlign='center'>Participants</Header></Segment>
                {_.map(participants, (e, i) => converter(e, i))}
              </Segment.Group>
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
  profiles: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Events');
  const subscription1 = Meteor.subscribe('Registrants');
  const subscription2 = Meteor.subscribe('Clubs');
  const subscription3 = Meteor.subscribe('Profiles');
  return {
    Id: documentId,
    currentUser: Meteor.user() ? Meteor.user().username : '',
    profiles: Profiles.find().fetch(),
    event: Events.findOne(documentId),
    clubs: Clubs.find().fetch(),
    registrants: Registrants.find({ event: documentId }).fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(EventInformation);
