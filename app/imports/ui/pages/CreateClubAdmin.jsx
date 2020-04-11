import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { ClubData } from '../../api/clubdata/ClubData';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  clubName: String,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  image: String,
  clubWebsite: String,
  description: String,
});

/** Renders the Page for adding a document. */
class CreateClubAdmin extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { clubName, firstName, lastName, email, phoneNumber, image, clubWebsite, description } = data;
    const owner = Meteor.user().username;
    ClubData.insert({ clubName, firstName, lastName, email, phoneNumber, image, clubWebsite, description, owner },
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
            <Header as="h2" textAlign="center" inverted>Create Club</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <TextField name='clubName'/>
                <Form.Group widths={'equal'}>
                  <TextField name='firstName' showInlineError={true} placeholder={"Founder's First Name"}/>
                  <TextField name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                  <TextField name='email' showInlineError={true} placeholder={'Email'}/>
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <TextField name='phoneNumber' showInlineError={true} placeholder={'Phone number'}/>
                  <TextField name='clubWebsite' showInlineError={true} placeholder={'http://'}/>
                  <TextField name='image' showInlineError={true} placeholder={'Image URL'}/>
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

export default CreateClubAdmin;
