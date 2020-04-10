import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Request extends React.Component {
  render() {
    return (
        <Card color='green'>
          <Card.Content>
            <Card.Header>{this.props.request.firstName} {this.props.request.lastName}</Card.Header>
            <Card.Description>
              {this.props.request.description}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            {this.props.request.owner}
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Request.propTypes = {
  request: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Request);
