import React from 'react';
import { Grid, Loader, Header, Segment, Form } from 'semantic-ui-react';
// import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import 'uniforms-bridge-simple-schema-2';

const ClubSchema = new SimpleSchema({
  clubName: String,
  clubEmail: String,
  clubWebsite: { type: String, optional: true },
  clubImage: String,
  clubBackground: String,
  description: String,
  owner: String,
});

class EditClub extends React.Component {

  // Temporary placeholder
  TestData = {
    clubName: 'Cat Lovers', clubImage: 'https://dcist.com/wp-content/uploads/sites/3/2019/04/Gem2-1500x1346.jpg',
    clubEmail: 'catlovers@foo.com', clubWebsite: '',
    clubBackground: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ficatcare.org%2F&psig=AOvVaw0VJYu5CVZ7-' +
        'NLk9VxLIm6-&ust=1586897852166000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOjQw6il5ugCFQAAAAAdAAAAABAD',
    description: 'For people who loves cats, but anyone is welcome!',
    owner: 'john@foo.com',
  }

  render() {
    return (this.TestData) ? this.renderPage() : <Loader>Fetching Data</Loader>;
  }

  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Edit Club Info</Header>
              <AutoForm schema={ClubSchema} model={this.TestData}>
                <Segment>
                  <Form.Group widths='equal'>
                    <TextField disabled name='clubName'/>
                    <TextField disabled name='clubEmail'/>
                  </Form.Group>
                  <TextField name='clubWebsite'/>
                  <TextField name='clubImage'/>
                  <TextField name='clubBackground'/>
                  <LongTextField name='description'/>
                  <SubmitField value='Save Changes'/>
                  <ErrorsField/>
                  <HiddenField name='owner' />
                </Segment>
              </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

// in the future, propTypes will need to be implemented here

// refer back to other example edit jsx, this is not the correct way to implement this for the /_id and for mongo
export default EditClub;
