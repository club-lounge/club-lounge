import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { withTracker } from 'meteor/react-meteor-data';
import { Loader, Container, Grid, Table, Button, Icon, Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { Tags } from '../../api/tag/Tags';

const formSchema = new SimpleSchema({
  newTag: String,
});

class TagManagement extends React.Component {
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting Data</Loader>;
  }

  submit(data, formRef) {
    const { newTag } = data;
    Tags.insert({ _id: newTag }, (err) => {
      if (err) {
        swal('Error', err.message, 'error');
      } else {
        formRef.reset();
        swal('Added', `New tag ${newTag} has been added!`, 'success');
      }
    });
  }

  renderPage() {
    const sortedData = _.sortBy(this.props.tags, ['_id']);

    const converter = (e) => {
      const onDelete = () => {
        Tags.remove(e._id);
        swal('Removed', `Tag ${e._id} has been removed`, 'success');
      };

      return (
          <Table.Row key={e._id}>
            <Table.Cell>{e._id}</Table.Cell>
            <Table.Cell textAlign='right'>
              <Button icon onClick={onDelete} color='red'><Icon name='trash'/></Button>
            </Table.Cell>
          </Table.Row>
      );
    };

    let fRef = null;

    return (
        <Container>
          <Header as='h1' inverted textAlign='center'>Event Tag Management</Header>
          <Grid>
            <Grid.Column width={9}>

              <Table>
                <Table.Header>
                  <Table.HeaderCell>Tag</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {_.map(sortedData, converter)}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column width={7}>

              <AutoForm ref={ref => {
                fRef = ref;
              }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='newTag' placeholder='New Event Tag' iconLeft='tags'/>
                  <SubmitField value='Add'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>

            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

TagManagement.propTypes = {
  tags: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const subscription = Meteor.subscribe('Tags');
  return {
    tags: Tags.find().fetch(),
    ready: subscription.ready(),
  };
})(TagManagement);
