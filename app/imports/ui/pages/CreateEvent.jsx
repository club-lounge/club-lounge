import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Loader, Grid, Segment, Form, Button, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField,
  DateField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import { Tags } from '../../api/tag/Tags';
import { Events } from '../../api/event/Events';

const EventSchema = new SimpleSchema({
  eventName: String,
  location: String,
  start: Date,
  end: Date,
  image: String,
  description: { type: String, defaultValue: '', optional: true },
  club: String,
});

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [], willRedirect: null };
  }

  handleChange = (e, { value }) => {
    this.setState({ tags: value });
  };

  render() {
    return (this.props.ready) ? this.security() : <Loader>Fetching Data</Loader>;
  }

  security() {
    const target = _.find(this.props.members, (e) => e.member === this.props.currentUser);
    let check = false;
    if (target) {
      check = target.role === 'owner' || target.role === 'officer';
    }

    return (check) ? this.renderPage() : (
        <Container>
          <Header as='h1' inverted textAlign='center'>Improper Permission</Header>
        </Container>
    );
  }

  renderPage() {
    if (this.state.willRedirect) {
      return <Redirect to={this.state.willRedirect}/>;
    }

    const back = `/clubinfo/${this.props.documentId}`;
    const total = _.map(this.props.tags, (e) => ({ key: e._id, text: e._id, value: e._id }));
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Create New Event</Header>
            <AutoForm schema={EventSchema} onSubmit={data => this.submit(data)}>
              <Segment>
                <TextField name='eventName'/>
                <Form.Group widths='equal'>
                  <DateField name='start'/>
                  <DateField name='end'/>
                </Form.Group>
                <TextField name='image'/>
                <TextField name='location'/>
                <LongTextField name='description'/>
                <Dropdown placeholder='Tag Search'
                          fluid multiple selection options={total} onChange={this.handleChange}/><br/>
                <SubmitField value='Create New Event'/>
                <ErrorsField/>
                <HiddenField name='club' value={this.props.documentId}/>
              </Segment>
              <Button as={NavLink} floated='left' color='teal' exact to={back}>Back</Button>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }

  submit(data) {
    const { eventName, location, start, end, image, description, club } = data;
    if (end <= start) {
      swal('Invalid Time', 'Your start time is bigger than or equal to the end time', 'error');
      return;
    }
    Events.insert({ eventName, location, start, end, image, description, club, tags: this.state.tags },
        (error, newId) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            const newEvent = `/eventinfo/${newId}`;
            swal({
              icon: 'success',
              title: 'Success!',
              text: 'New event for your club has been created',
              button: 'Cool!',
            });
            this.setState({ willRedirect: newEvent });
          }
        });
  }
}

CreateEvent.propTypes = {
  documentId: PropTypes.string.isRequired,
  club: PropTypes.object,
  members: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
  tags: PropTypes.array,
};

export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const sub = Meteor.subscribe('Clubs');
  const sub1 = Meteor.subscribe('MembersAll');
  const sub2 = Meteor.subscribe('Tags');
  return {
    documentId: documentId,
    club: Clubs.findOne(documentId),
    members: Members.find({ club: documentId }).fetch(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
    ready: sub.ready() && sub1.ready() && sub2.ready(),
    tags: Tags.find().fetch(),
  };
})(CreateEvent);
