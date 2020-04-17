import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';
import { Creates } from '../../api/create/Creates';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Create extends React.Component {
  render() {
    return (
        <Card color='green' centered>
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
              <Button basic color='red' onClick={() => this.onDecline()}>
                Decline
              </Button>
              <Button basic color='green' onClick={() => this.onApprove(this.props.create)}>
                Approve
              </Button>
            </div>
          </Card.Content>
        </Card>
    );
  }

  onDecline() {
    Creates.update(this.props.create._id, { $set: { approve: false } });
  }

  onApprove(data) {
    Clubs.insert({
          clubName: data.clubName, clubEmail: data.clubEmail, clubWeb: data.clubWeb, image: data.image,
          description: data.description },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            Members.insert({ member: data.owner, clubName: data.clubName, role: 'owner' });
            Creates.remove(this.props.create._id);
          }
        });
  }
}

/** Require a document to be passed to this component. */
Create.propTypes = {
  create: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Create);
