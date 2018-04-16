import React from 'react';
import { Container, Header, Button, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Container fluid>
          <Container fluid className="landing-background" textAlign="center">
            <Container>
              <Header inverted as="h1">Campus Cloud</Header>
              <Header inverted as="h2">
                A simple, clean, and easy-to-use interface to view and explore all of the Registered Independent Organizations
                (RIOs) at the University of Hawaiʻi at Mānoa.
              </Header>
              <Button as={Link} inverted basic to="/list" className="list-button" style={{ marginTop: '10vh',
                fontSize: '20px' }}>Discover Mānoa RIOs</Button>
            </Container>
          </Container>
          <Grid container centered stackable textAlign='center' columns={3} className="landing-content"
                style={{ background: '#0091EA' }}>
            <Grid.Column width={6} textAlign="center">
              <div className="feature">
                <Icon size="big" name="search" />
                <div className="heading">Discover</div>
              </div>
            </Grid.Column>

            <Grid.Column width={10} textAlign="center">
              <span className="feature">Use the search to discover new RIOs based on your interests. You’ll be able to sort by tags to find clubs and organizations that you never knew existed. You can also list your interests in your profile to be notified whenever an organization that matches your interests is created.</span>
            </Grid.Column>
          </Grid>

          <Grid container centered stackable textAlign='center' columns={3} className="landing-content"
                style={{ background: '#2962FF' }}>
            <Grid.Column width={10} textAlign="center">
              <span className="feature">Sort and refine your search results based on various filters.</span>
            </Grid.Column>

            <Grid.Column width={6} textAlign="center">
              <div className="feature">
                <Icon size="big" name="filter" />
                <div className="heading">Filter</div>
              </div>
            </Grid.Column>
          </Grid>

          <Grid container centered stackable textAlign='center' columns={3} className="landing-content"
                style={{ background: '#304FFE' }}>
            <Grid.Column width={6} textAlign="center">
              <div className="feature">
                <Icon size="big" name="sort content ascending" />
                <div className="heading">Feature</div>
              </div>
            </Grid.Column>

            <Grid.Column width={10} textAlign="center">
              <span className="feature">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas risus orci, viverra quis lacinia id, volutpat vel ligula. Nunc sodales eu risus in pretium. Proin cursus mauris odio, condimentum tempor tortor pellentesque et. Morbi consequat velit dolor, vel vestibulum purus tempor vestibulum.</span>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

export default Landing;
