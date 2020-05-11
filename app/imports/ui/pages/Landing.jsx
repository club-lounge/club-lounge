import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Header, Button, Grid, Segment, Icon, Card, Container, Loader } from 'semantic-ui-react';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import Club from '../components/Club';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  visitorPage = (
      <div className='landing-page' style={{ paddingBottom: this.props.currentUser ? '5em' : '10em' }}>
        <Header className="large-header" textAlign='center'
                style={{
                  fontSize: '7em', color: '#21BA45', paddingTop: this.props.currentUser ? '0.2em' : '2em',
                  textShadow: '0 0 0.2em #000',
                }}>
          Club Lounge
          <Header.Subheader style={{ fontSize: '0.25em', color: '#21BA45', textShadow: '0 0 0.2em #000' }}>
            Your local host of clubs for UH@Manoa
          </Header.Subheader>
        </Header>
        <Grid centered style={{ paddingBottom: '10em' }}>
          <Button.Group size='massive'>
            <Button color='green' as={NavLink} exact to='/signin/'>Sign In</Button>
            <Button.Or/>
            <Button as={NavLink} exact to='/signup/'>Sign Up</Button>
          </Button.Group>
        </Grid>
      </div>
  )

  userPage = () => (
      <div className='landing-page' style={{ paddingBottom: this.props.currentUser ? '5em' : '10em' }}>
        <Grid container stackable centered columns={3}>
          <Grid.Column>
            <Segment textAlign='center' className='big-3'>
              <Icon size='huge' name='calendar outline'/>
              <Header className='landing-title' as='h1'>Upcoming Events</Header>
              <hr/>
              You can see all the upcoming
              events hosted by the clubs at UH Manoa, and
              let you register for the event as well as
              see more info about the event.
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign='center' className='big-3'>
              <Icon size='huge' name='user plus'/>
              <Header className='landing-title' as='h1'>Join a Club</Header>
              <hr/>
              You can join clubs available through the application
              and see more information about the club itself.
              Once you click on the see more information, it
              shows you events they are hosting as well.
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign='center' className='big-3'>
              <Icon size='huge' name='pencil alternate'/>
              <Header className='landing-title' as='h1'>Create a Club</Header>
              <hr/>
              Another great feature is you can create a club,
              and you have to wait for the admins approvel
              to post events you are hosting.
            </Segment>
          </Grid.Column>
        </Grid>
        <br/><br/>
        {this.cardGroups()}
      </div>
  )

  render() {
    return (
        <div>
          {(this.props.currentUser) === '' ? this.visitorPage : this.userPage()}
        </div>
    );
  }

  cardGroups() {
    const data = _.pluck(this.props.members, 'club');
    if (!this.props.ready) {
      return <Loader>Fetching Data</Loader>;
    }

    if (data.length === 0) {
      return ('');
    }

    const result = _.filter(this.props.clubs, (e) => _.contains(data, e._id));

    return (
        <Container>
          <Header className="large-header" textAlign='center'
                  style={{ fontSize: '3em', color: '#21BA45', paddingTop: '1em', textShadow: '0 0 0.2em #000' }}>
            My Clubs
          </Header>
          <Card.Group>
            {result.map((club, index) => <Club key={index} club={club}/>)}
          </Card.Group>
        </Container>
    );
  }
}

Landing.propTypes = {
  currentUser: PropTypes.string,
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  members: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const Id = Meteor.user() ? Meteor.user().username : '';
  const sub = Meteor.subscribe('Clubs');
  const sub1 = Meteor.subscribe('Members');
  return {
    currentUser: Id,
    members: Members.find({ member: Id }).fetch(),
    clubs: Clubs.find().fetch(),
    ready: sub.ready() && sub1.ready(),
  };
})(Landing);
