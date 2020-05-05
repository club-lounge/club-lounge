import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Loader, Grid, Segment, Form, Button, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField,
  DateField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
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

class EditEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: null };
  }

  handleChange = (e, { value }) => {
    this.setState({ tags: value });
  };

  render() {
    return (this.props.ready) ? this.security() : <Loader>Fetching Data</Loader>;
  }

  security() {
    const target = _.find(_.filter(this.props.members, (i) => i.club === this.props.event.club),
        (e) => e.member === this.props.currentUser);
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
    if (!this.state.tags) {
      this.setState({ tags: this.props.event.tags });
    }
    const back = `/eventinfo/${this.props.documentId}`;
    const total = _.map(this.props.tags, (e) => ({ key: e._id, text: e._id, value: e._id }));
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Edit Event</Header>
            <AutoForm schema={EventSchema} onSubmit={data => this.submit(data)} model={this.props.event}>
              <Segment>
                <TextField disabled name='eventName'/>
                <Form.Group widths='equal'>
                  <DateField name='start'/>
                  <DateField name='end'/>
                </Form.Group>
                <TextField name='image'/>
                <TextField name='location'/>
                <LongTextField name='description'/>
                <Dropdown placeholder='Tag Search' defaultValue={this.props.event.tags}
                          fluid multiple selection options={total} onChange={this.handleChange}/><br/>
                <SubmitField value='Update Event'/>
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
    const { location, start, end, image, description } = data;
    if (end <= start) {
      swal('Invalid Time', 'Your start time is bigger than or equal to the end time', 'error');
      return;
    }
    Events.update(this.props.documentId, { $set: { location, start, end, image, description, tags: this.state.tags } },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal({
              icon: 'success',
              title: 'Done!',
              text: 'Event has been updated',
              button: 'Cool!',
            });
          }
        });
  }
}

EditEvent.propTypes = {
  documentId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  tags: PropTypes.array,
};

export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const sub1 = Meteor.subscribe('MembersAll');
  const sub2 = Meteor.subscribe('Tags');
  const sub3 = Meteor.subscribe('Events');
  return {
    documentId: documentId,
    event: Events.findOne(documentId),
    members: Members.find().fetch(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
    tags: Tags.find().fetch(),
  };
})(EditEvent);
