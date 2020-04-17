import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Creates } from '../../api/create/Creates';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  clubName: String,
  clubEmail: String,
  image: String,
  clubWeb: String,
  description: String,
});

/** Renders the Page for adding a document. */
class CreateClub extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { clubName, clubEmail, image, clubWeb, description } = data;
    const owner = Meteor.user().username;
    Creates.insert({ clubName, clubEmail, image, clubWeb, description, owner },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Request submitted, please wait for approval', 'success');
            formRef.reset();
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Create a Club</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <Form.Group widths={'equal'}>
                  <TextField name='clubName'/>
                  <TextField name='clubEmail'/>
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <TextField name='image'/>
                  <TextField name='clubWeb'/>
                </Form.Group>
                <LongTextField name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateClub;
