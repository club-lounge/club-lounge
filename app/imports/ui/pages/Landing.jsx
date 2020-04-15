import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Header, Button, Grid, Segment, Icon } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  visitorPage = (
      <div className='landing-page' style={{ paddingBottom: this.props.currentUser ? '5em' : '10em' }}>
        <Header className="large-header" textAlign='center'
                style={{
                  fontSize: '7em', color: '#fff', paddingTop: this.props.currentUser ? '0.2em' : '2em',
                  textShadow: '1.4px 1.4px #2c3e50',
                }}>
          Club Lounge
          <Header.Subheader style={{ fontSize: '0.25em', color: '#fff', textShadow: '1.4px 1.4px #2c3e50' }}>
            Your local host of clubs for UH@Manoa
          </Header.Subheader>
        </Header>
        <Grid centered>
          <Button.Group size='massive'>
            <Button color='green' as={NavLink} exact to='/signin/'>Sign In</Button>
            <Button.Or/>
            <Button as={NavLink} exact to='/signup/'>Sign Up</Button>
          </Button.Group>
        </Grid>
      </div>
  )

  userPage = (
      <div className='landing-page' style={{ paddingBottom: this.props.currentUser ? '5em' : '10em' }}>
        <Grid container stackable centered columns={3}>
          <Grid.Column>
            <Segment inverted textAlign='center'>
              <Icon inverted size='huge' name='calendar outline'></Icon>
              <Header as='h1'>Upcoming Events</Header>
              <hr/>
              You can see all the upcoming
              events hosted by the clubs at UH Manoa, and
              let you register for the event as well as
              see more info about the event.
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted textAlign='center'>
              <Icon inverted size='huge' name='user plus'></Icon>
              <Header as='h1'>Join a Club</Header>
              <hr/>
              You can join clubs available through the application
              and see more information about the club itself.
              Once you click on the see more information, it
              shows you events they are hosting as well.
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted textAlign='center'>
              <Icon inverted size='huge' name='pencil alternate'></Icon>
              <Header as='h1'>Create a Club</Header>
              <hr/>
              Another great feature is you can create a club,
              and you have to wait for the admins approvel
              to post events you are hosting.
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
  )

  render() {
    return (
        <div>
          {
            this.props.currentUser === '' ? this.visitorPage : this.userPage
          }
        </div>
    );
  }
}

Landing.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(Landing);

export default withRouter(LandingContainer);
