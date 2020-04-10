import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className='landing-page' style={{ paddingBottom: this.props.currentUser ? '5em' : '30em' }}>
          <Header className="large-header" textAlign='center'
                  style={{ fontSize: '7em', color: '#024731', paddingTop: this.props.currentUser ? '0.2em' : '2em' }}>
            Club Lounge
            <Header.Subheader style={{ fontSize: '0.25em', color: '#024731' }}>
              Your local host of clubs for UH@Manoa
            </Header.Subheader>
          </Header>
          <br/><br/>
          <Grid centered>
            {
              this.props.currentUser === '' ? (
                  <Button.Group size='huge'>
                    <Button color='green' as={NavLink} exact to='/signin/'>Sign In</Button>
                    <Button.Or/>
                    <Button as={NavLink} exact to='/signup/'>Sign Up</Button>
                  </Button.Group>
              ) : (
                  <Segment.Group raised piled style={{ backgroundColor: 'white' }}>
                    <Segment><Header as='h1'>Upcoming Events</Header></Segment>
                    <Segment>All upcoming event goes here as comment format.</Segment>
                  </Segment.Group>
              )
            }
          </Grid>
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
