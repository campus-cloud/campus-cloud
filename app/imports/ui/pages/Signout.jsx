import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header } from 'semantic-ui-react';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
        <Container className="content">
          <Header as="h2" textAlign="center">
            <p>You have been signed out.</p>
          </Header>
        </Container>
    );
  }
}
