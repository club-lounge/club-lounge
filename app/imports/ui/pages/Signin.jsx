import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, NavLink } from 'react-router-dom';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Container, Grid, Header, Message, Segment, Button } from 'semantic-ui-react';

const formSchema = new SimpleSchema({
  email: String,
  password: String,
});

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: '', redirectToReferer: false };
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit(data, formRef) {
    const { email, password } = data;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
        swal('Error', err.message, 'error');
      } else {
        formRef.reset();
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Render the signin form. */
  render() {
    let fRef = null;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    // Otherwise return the Login form.
    return (
      <Container style={{ marginTop: '2em' }}>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>Login to your account</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='email' placeholder='E-mail address' iconLeft='user'/>
                <TextField name='password' type='password' placeholder='Password' iconLeft='lock'/>
                <SubmitField value='Login'/>
                <Button as={NavLink} floated='right' color='teal' exact to='/'>Back to Home Page</Button>
                <ErrorsField/>
              </Segment>
            </AutoForm>
            <Message>
              <Link to="/signup">Click here to Register</Link>
            </Message>
            {this.state.error === '' ? (
                ''
            ) : (
                <Message
                    error
                    header="Login was not successful"
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
Signin.propTypes = {
  location: PropTypes.object,
};
