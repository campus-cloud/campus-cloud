import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Segment, Label } from 'semantic-ui-react';
import { Stuffs } from '/imports/api/stuff/stuff';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ListStuff extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center">User Page</Header>
          <Header as="h5" textAlign="right" color='blue'>Edit Page</Header>
          <Header as="h2">EMAIL: user@clo.ud</Header>
          <Header as="h2">Interests:</Header>
          <Segment padded>
            <Label as='a' tag>Exercise</Label>
            <Label as='a' tag>Animals</Label>
            <Label as='a' tag>Outdoors</Label>
            <Label as='a' tag>Music</Label>
          </Segment>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ListStuff.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Stuff');
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ListStuff);
