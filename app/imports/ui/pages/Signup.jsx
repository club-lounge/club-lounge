import React from 'react';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { Button, Container, Grid, Header, Message, Segment, Form } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { Profiles } from '../../api/profile/Profiles';

const formSchema = new SimpleSchema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  image: { type: String, optional: true, defaultValue: '' },
});
/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  // you will need this later: https://guide.meteor.com/accounts.html

  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { error: '', redirectToReferer: false };
  }

  /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit(data, formRef) {
    const { email, password, firstName, lastName, image } = data;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
        swal('Error', err.message, 'error');
      } else {
        formRef.reset();
        Profiles.insert({ _id: email, firstName: firstName, lastName: lastName, image: image });
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Display the signup form. Redirect to add page after successful registration and login. */
  render() {
    let fRef = null;
    const { from } = this.props.location.state || { from: { pathname: '/joinclub' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
        <Container style={{ marginTop: '2em' }}>
          <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
            <Grid.Column>
              <Header as="h2" textAlign="center" inverted>
                Register your account
              </Header>
              <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
                <Segment>
                  <Form.Group widths='equal'>
                    <TextField name='firstName' placeholder='Your first name' grid='equal'/>
                    <TextField name='lastName' placeholder='Your last name' grid='equal'/>
                  </Form.Group>
                  <TextField name='image' placeholder='Profile Picture Link' iconLeft='image'/>
                  <TextField name='email' placeholder='E-mail address' iconLeft='user'/>
                  <TextField name='password' type='password' placeholder='Password' iconLeft='lock'/>
                  <SubmitField value='Register'/>
                  <Button as={NavLink} floated='right' color='teal' exact to='/'>Back to Home Page</Button>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
              <Message>
                Already have an account? Login <Link to="/signin">here</Link>
              </Message>
              {this.state.error === '' ? (
                  ''
              ) : (
                  <Message
                      error
                      header="Registration was not successful"
                      content={this.state.error}
                  />
              )}
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
