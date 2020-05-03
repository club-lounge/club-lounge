import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Container, Header, Image, Loader, Table } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import { Profiles } from '../../api/profile/Profiles';

class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { column: null, direction: null, data: null };
  }

  updateData() {
    const addToProfile = (e) => {
      e.role = (_.find(this.props.members, (i) => i.member === e._id)).role;
      return e;
    };
    const merged = _.map(this.props.profiles, addToProfile);
    console.log(merged);
    this.setState({ data: merged });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.security() : <Loader active>Getting data</Loader>;
  }

  security() {
    const target = _.find(this.props.members, (e) => e.member === this.props.currentUser);
    const check = target.role === 'owner';
    return (check) ? this.renderPage() : (
        <Container>
          <Header as='h1' inverted textAlign='center'>Improper Permission</Header>
        </Container>
    );
  }

  renderPage() {
    // some code from semantic UI react documentation on table
    const { column, data, direction } = this.state;

    if (!data) {
      this.updateData();
    }

    const handleSort = (e) => () => {
      if (column !== e) {
        this.setState({
          column: e,
          direction: 'ascending',
          data: _.sortBy(data, [e]),
        });
      } else {
        this.setState({
          data: data.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        });
      }
    };

    function convertToRow(e) {
      return (
          <Table.Row key={e._id}>
            <Table.Cell><Image centered src={e.image} size='mini'/></Table.Cell>
            <Table.Cell>{e.firstName}</Table.Cell>
            <Table.Cell>{e.lastName}</Table.Cell>
            <Table.Cell>{e._id}</Table.Cell>
            <Table.Cell>{e.role}</Table.Cell>
            <Table.Cell>Transfer</Table.Cell>
          </Table.Row>
      );
    }

    return (
        <Container>
          <Header as='h1' inverted textAlign='center'>{`${this.props.club.clubName} Member Management`}</Header>
          <Table sortable celled compact definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell/>
                <Table.HeaderCell sorted={column === 'firstName' ? direction : null}
                                  onClick={handleSort('firstName')}>First Name</Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'lastName' ? direction : null}
                                  onClick={handleSort('lastName')}>Last Name</Table.HeaderCell>
                <Table.HeaderCell sorted={column === '_id' ? direction : null}
                                  onClick={handleSort('_id')}>Email</Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'role' ? direction : null}
                                  onClick={handleSort('role')}>Club Role</Table.HeaderCell>
                <Table.HeaderCell>Transfer Ownership</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(data, convertToRow)}
            </Table.Body>
          </Table>
        </Container>
    );
  }
}

MemberList.propTypes = {
  club: PropTypes.object,
  members: PropTypes.array,
  profiles: PropTypes.array,
  currentUser: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Clubs');
  const subscription1 = Meteor.subscribe('MembersAll');
  const subscription2 = Meteor.subscribe('Profiles');
  return {
    club: Clubs.findOne(documentId),
    members: Members.find({ club: documentId }).fetch(),
    profiles: Profiles.find().fetch(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
    ready: subscription.ready() && subscription1.ready() && subscription2.ready(),
  };
})(MemberList);
