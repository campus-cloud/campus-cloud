import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Card, Loader, Button, Icon } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import ClubCardAdmin from '/imports/ui/components/ClubCardAdmin';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders a table containing all of the Club documents. Use <ClubCard> to render each club. */
class ListClubs extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container className="content">
          <Header as="h2" textAlign="center">Club List</Header>
          <Button inverted basic color='green' className="new-button">
          <Icon name='add' />
          Add Club
          </Button>
          <Card.Group>
            {this.props.clubs.map((club, index) => <ClubCardAdmin key={index} club={club} />)}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Club documents in the props. */
ListClubs.propTypes = {
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
})(ListClubs);
