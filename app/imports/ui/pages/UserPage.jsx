import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Segment, Label, Message, Icon } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class UserPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container className='content'>
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
          <Header as="h2" color='red'>News:</Header>
          <Message compact>
            <Icon className='alarm outline'/>
            New clubs have been added to the list. Check it Out!
          </Message>
        </Container>
    );
  }
}

/** Require an array of Club documents in the props. */
UserPage.propTypes = {
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Clubs documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(UserPage);
