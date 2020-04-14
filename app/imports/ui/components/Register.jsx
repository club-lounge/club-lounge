import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Register extends React.Component {
  render() {
    return (
        <Card color='green'>
          <Card.Content>
            <Card.Header>
              {this.props.register.firstName} {this.props.register.lastName}
            </Card.Header>
            <Card.Meta>{this.props.register.email}</Card.Meta>
          </Card.Content>

          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green'>
                Approve
              </Button>
              <Button basic color='red'>
                Decline
              </Button>
            </div>
          </Card.Content>

          <Card.Content extra>
            {this.props.register.owner}
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Register.propTypes = {
  register: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Register);
