import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Registrants } from '../../api/register/Registrants';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  eventName: String,
  firstName: String,
  lastName: String,
  email: String,
});

/** Renders the Page for adding a document. */
class RegisterEvent extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { eventName, firstName, lastName, email } = data;
    const owner = Meteor.user().username;
    Registrants.insert({ eventName, firstName, lastName, email, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Registered successfully', 'success');
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
            <Header as="h2" textAlign="center" inverted>Register</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='eventName'/>
                <Form.Group widths={'equal'}>
                  <TextField name='firstName'/>
                  <TextField name='lastName'/>
                </Form.Group>
                <TextField name='email'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default RegisterEvent;
