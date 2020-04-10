import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Requests } from '../../api/requests/Requests';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  description: String,
});

/** Renders the Page for adding a document. */
class RequestEvent extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { firstName, lastName, description } = data;
    const owner = Meteor.user().username;
    Requests.insert({ firstName, lastName, description, owner },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Request added successfully', 'success');
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
            <Header as="h2" textAlign="center" inverted>Request an Event</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <TextField name='firstName'/>
                <TextField name='lastName'/>
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

export default RequestEvent;
