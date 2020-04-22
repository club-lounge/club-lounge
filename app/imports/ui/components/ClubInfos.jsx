import React from 'react';
import { Container, Header, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubInfos extends React.Component {
  render() {
    return (
        <Container text>
          <Header as='h2' textAlign="center" inverted>{this.props.clubinfo.clubName}</Header>
          <Image centered>{this.props.clubinfo.image}</Image>
          <p>{this.props.clubinfo.description}</p>
        </Container>
    );
  }
}

/** Require a document to be passed to this component. */
ClubInfos.propTypes = {
  clubinfo: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubInfos);
