import React from 'react';
import { Grid, Loader, Header, Segment, Form, Container } from 'semantic-ui-react';
import swal from 'sweetalert';
import _ from 'underscore';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField, HiddenField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';

const ClubSchema = new SimpleSchema({
  clubName: String,
  image: String,
  description: String,
  clubWeb: { type: String, optional: true },
  clubEmail: String,
  _id: String,
});

class EditClub extends React.Component {

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
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Edit Club Info</Header>
              <AutoForm schema={ClubSchema} model={this.props.club} onSubmit={data => this.submit(data)}>
                <Segment>
                  <Form.Group widths='equal'>
                    <TextField disabled name='clubName'/>
                    <TextField name='clubEmail'/>
                  </Form.Group>
                  <TextField name='clubWeb'/>
                  <TextField name='image'/>
                  <LongTextField name='description'/>
                  <SubmitField value='Save Changes'/>
                  <ErrorsField/>
                  <HiddenField name='_id'/>
                </Segment>
              </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }

  submit(data) {
    const { clubName, clubEmail, image, clubWeb, description, _id } = data;
    Clubs.update(_id, { $set: { clubName, clubEmail, image, clubWeb, description } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Club updated successfully', 'success')));
  }
}

EditClub.propTypes = {
  club: PropTypes.object,
  members: PropTypes.array,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.string,
};

export default withTracker(({ match }) => {
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Clubs');
  const subscription1 = Meteor.subscribe('Members');
  return {
    club: Clubs.findOne(documentId),
    members: Members.find({ club: documentId }).fetch(),
    ready: subscription.ready() && subscription1.ready(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(EditClub);
