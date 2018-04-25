import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Segment, Message, Icon, Button, List, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Interests } from '../../api/interests/interests';

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
          <Button floated="right" color='blue'>Edit Page</Button>
          <Header as="h2">EMAIL:<a>{this.props.currentUser}</a></Header>
          <Header as="h2">Interests:</Header>
          <Segment>
            <List>
              <Label tag>
            { this.props.interests.map(interest => interest.interests + ', ')}
              </Label>
            </List>
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
  interests: PropTypes.array,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Clubs documents.
  const subscription = Meteor.subscribe('Clubs');
  const subscription2 = Meteor.subscribe('Interests');

  return {
    interests: Interests.find().fetch(),
    ready: subscription.ready() && subscription2.ready(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(UserPage);
