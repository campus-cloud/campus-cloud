import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Button, Icon, Form, Card, Loader } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import ClubCard from '/imports/ui/components/ClubCard';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';

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
          <Header as="h2" textAlign="center">Browse Clubs</Header>

          <Form style={{ margin: '0 4vw 15px' }}>
            <input type="text" placeholder="Search..." style={{ width: '87%', minWidth: 'calc(100% - 150px)', height: '50px', borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '15px', lineHeight: '15px' }} />
            <Button id="search" style={{ width: '13%', maxWidth: '150px', height: '50px', margin: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, fontSize: '15px', lineHeight: '15px' }}>Search</Button>
          </Form>

          {Roles.userIsInRole(Meteor.userId(), 'admin') ?
              <Button inverted basic color='green' className="new-button">
                <Icon name='add' />
                Add Club
              </Button>
              : ''}

          <Card.Group style={{ marginTop: '10px' }}>
            {this.props.clubs.map((club, index) => <ClubCard key={index} club={club} />)}
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
