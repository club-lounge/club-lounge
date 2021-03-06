import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Segment, Container, Header, Image, Loader, Grid, Button, Divider, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import { Profiles } from '../../api/profile/Profiles';
import { Events } from '../../api/event/Events';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubInformation extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  linkProcess(link) {
    if (link.toLowerCase().startsWith('http')) {
      return link;
    }
    return `https://${link}`;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const club = this.props.club;
    const eventData = (_.sortBy(_.filter(this.props.events, (e) => e.club === this.props.club._id), ['end'])).reverse();

    function join(data) {
      Members.insert({
        member: Meteor.user().username, club: data,
      });
      swal({
        title: 'Joined!',
        text: `You are now part of: ${club.clubName}`,
        icon: 'success',
        button: 'Got it',
      });
    }

    function leave(id) {
      Members.remove(id);
      swal({
        title: 'Left!',
        text: `You left the club: ${club.clubName}`,
        icon: 'warning',
        button: 'Got it',
      });
    }

    let board = [];
    let user;

    function finder(input) {
      if (input.member === Meteor.user().username) {
        user = input;
      }
      if (input.role !== 'member') {
        board.push(input);
        return false;
      }
      return true;
    }

    let members = _.filter(this.props.members, finder);

    members = _.map(members, (e) => _.find(this.props.profiles, (i) => i._id === e.member));
    board = _.map(board, (e) => {
      const ret = _.find(this.props.profiles, (i) => i._id === e.member);
      if (ret) {
        ret.role = e.role;
      }
      return ret;
    });

    members = _.sortBy(members, 'lastName');
    board = _.sortBy(board, 'lastName');

    function converter(e, index) {
      let color = '';
      if (e.role === 'owner') {
        color = 'yellow';
      } else
        if (e.role === 'officer') {
          color = 'green';
        } else {
          color = 'olive';
        }
      return (
          <Segment key={index} color={color}>
            <Grid>
              <Grid.Column width={12}>
                <Header as='h5'>{`${e.firstName} ${e.lastName}`}</Header>
              </Grid.Column>
              <Grid.Column width={4}>
                <Image circular size='mini' src={e.image}/>
              </Grid.Column>
            </Grid>
          </Segment>
      );
    }

    function buttons() {
      const ret = [];
      if (user) {
        if (user.role !== 'owner') {
          ret.push((<Button key={2} color='red' icon labelPosition='left' onClick={() => leave(user._id)}>
            <Icon name='chevron circle left'/>
            Leave Club
          </Button>));
        } else {
          ret.push(<Button key={4} icon labelPosition='left' color='yellow' as={NavLink}
                           exact to={`/members_list/${club._id}`}>
            <Icon name='users'/>
            Member Management
          </Button>);
        }
        if (user.role !== 'member') {
          ret.push(<Button key={3} icon labelPosition='left' color='grey' as={NavLink}
                           exact to={`/editclub/${club._id}`}>
            <Icon name='edit'/>
            Edit Club Info
          </Button>);
          ret.push(<Button key={5} icon labelPosition='left' color='purple' as={NavLink}
                           exact to={`/new_event/${club._id}`}>
            <Icon name='calendar plus outline'/>
            New Event
          </Button>);
        }
      } else {
        ret.push((<Button key={1} color='green' icon labelPosition='left' onClick={() => join(club._id)}>
          <Icon name='chevron circle right'/>
          Join Club
        </Button>));
      }

      return (
          <Button.Group fluid>
            {ret}
          </Button.Group>
      );
    }

    function eventSeg(e, index) {
      return (
          <Segment key={index}>
            <Header as='h2'>{e.eventName}</Header>
            <p>{e.description}</p>
            <Divider/>
            <p>{e.start.toDateString()}</p>
            <p>{e.location}</p>
            <Button fluid color='grey' as={NavLink} exact to={`/eventinfo/${e._id}`}>
              More Info
            </Button>
          </Segment>
      );
    }

    return (
        <div>
          <Container>
            <Segment>
              <Header as="h1" textAlign="center">{this.props.club.clubName}</Header>
              <Divider/>
              {buttons()}
            </Segment>
            <Grid>
              <Grid.Column width={5}>
                <Segment textAlign='center'>
                  <Image centered rounded src={this.props.club.image} size='medium'/>
                  <p>{this.props.club.description}</p>
                  <a href={this.linkProcess(this.props.club.clubWeb)}><p>{this.props.club.clubWeb}</p></a>
                  <p>{this.props.club.clubEmail}</p>
                </Segment>
                <Button as={NavLink} floated='left' color='teal' exact to='/joinclub'>Back</Button>
              </Grid.Column>
              <Grid.Column width={7}>
                <Segment.Group raised>
                  {eventData.map((event, index) => eventSeg(event, index))}
                </Segment.Group>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <Header as='h4'> Board Members </Header>
                  <Segment.Group stacked>
                    {board.map((e, index) => converter(e, index))}
                  </Segment.Group>
                  <br/>
                  <Divider/>
                  <Header as='h4'> Members </Header>
                  {(members.length === 0) ? ('No Member') : ('')}
                  <Segment.Group stacked>
                    {members.map((e, index) => converter(e, index))}
                  </Segment.Group>
                  <br/>
                </Segment>
              </Grid.Column>
            </Grid>
          </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubInformation.propTypes = {
  club: PropTypes.object,
  members: PropTypes.array,
  events: PropTypes.array,
  ready: PropTypes.bool.isRequired,
  profiles: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Clubs');
  const subscription1 = Meteor.subscribe('MembersAll');
  const subscription2 = Meteor.subscribe('Profiles');
  const subscription3 = Meteor.subscribe('Events');
  return {
    club: Clubs.findOne(documentId),
    members: Members.find({ club: documentId }).fetch(),
    profiles: Profiles.find().fetch(),
    events: Events.find({ club: documentId }).fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(ClubInformation);
