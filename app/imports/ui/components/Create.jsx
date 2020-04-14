import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Create extends React.Component {
  render() {
    return (
        <Card color='green'>
          <Image wrapped src={this.props.create.image}/>
          <Card.Content>
            <Card.Header>{this.props.create.clubName}</Card.Header>
            <Card.Meta>
              {this.props.create.clubEmail}
            </Card.Meta>
            <Card.Description>
              {this.props.create.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            website: {this.props.create.clubWeb}
          </Card.Content>
          <Card.Content extra>
            owner: {this.props.create.owner}
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='red'>
                Decline
              </Button>
              <Button basic color='green'>
                Approve
              </Button>
            </div>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Create.propTypes = {
  create: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Create);
