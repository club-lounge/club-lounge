import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Header, Loader, Segment, Image, Container, Grid, Button, Table, Divider, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { Events } from '../../api/event/Events';
import { Clubs } from '../../api/club/Clubs';
import { Registrants } from '../../api/register/Registrants';
import { Profiles } from '../../api/profile/Profiles';
import { Members } from '../../api/members/Members';

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
      const begin = `${start.toDateString()} ${reformat(start.toTimeString())}`;
      const theEnd = `${end.toDateString()} ${reformat(end.toTimeString())}`;
      time = [(
          <Table.Row key='before'>
            <Table.Cell>
              Starts
            </Table.Cell>
            <Table.Cell>
              {begin}
            </Table.Cell>
          </Table.Row>), (
          <Table.Row key='after'>
            <Table.Cell>
              Ends
            </Table.Cell>
            <Table.Cell>
              {theEnd}
            </Table.Cell>
          </Table.Row>
      )];
    } else {
      const label = `${start.toDateString()} @ ${reformat(start.toTimeString())} - ${reformat(end.toTimeString())}`;
      time = (
          <Table.Row>
            <Table.Cell>
              Time
            </Table.Cell>
            <Table.Cell>
              {label}
            </Table.Cell>
          </Table.Row>
      );
    }

    let edit = '';
    const permission = _.find(this.props.members,
        (e) => e.club === this.props.event.club && e.member === this.props.currentUser);
    if (permission) {
      if (permission.role !== 'member') {
        edit = `/edit_event/${this.props.Id}`;
        edit = <Button as={NavLink} color='yellow' exact to={edit}>Edit Event</Button>;
      }
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
            <Grid columns={3}>
              <Grid.Column>
                <Button as={NavLink} color='teal' exact to='/upcomingevents'>Back</Button>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                {edit}
              </Grid.Column>
              <Grid.Column>
                {button}
              </Grid.Column>
            </Grid>
          </Segment>

          <Grid>
            <Grid.Column width={6}>
              <Segment>
                <Header textAlign="center" as="h2">{this.props.event.eventName}</Header>
                <Image src={this.props.event.image}/>
                <Header as="h3">{club.clubName}</Header>
                <p>{this.props.event.description}</p>
                {this.props.event.tags.map((e, i) => <Label tag color='teal' key={i}>{e}</Label>)}
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
  members: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const sub = Meteor.subscribe('Events');
  const sub1 = Meteor.subscribe('Registrants');
  const sub2 = Meteor.subscribe('Clubs');
  const sub3 = Meteor.subscribe('Profiles');
  const sub4 = Meteor.subscribe('MembersAll');
  return {
    Id: documentId,
    currentUser: Meteor.user() ? Meteor.user().username : '',
    members: Members.find().fetch(),
    profiles: Profiles.find().fetch(),
    event: Events.findOne(documentId),
    clubs: Clubs.find().fetch(),
    registrants: Registrants.find({ event: documentId }).fetch(),
    ready: sub.ready() && sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(EventInformation);
