import React from 'react';
import { Container, Header, Button, Grid, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Container fluid>
          <Container fluid className="landing-background" textAlign="center">
            <Container>
              <Header inverted as="h1">Campus Cloud</Header>
              <Header inverted as="h2">
                A clean, easy-to-use interface to view and explore all of the Registered Independent Organizations
                (clubs) at UH Mānoa.
              </Header>
              <Button as={NavLink} inverted basic to="/list" className="list-button" style={{ marginTop: '10vh',
                fontSize: '20px' }}>Club List</Button>
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
              <span className="feature">Discover clubs that match your interests.</span>
            </Grid.Column>
          </Grid>
          <Grid container centered stackable textAlign='center' columns={3} className="landing-content"
                style={{ background: '#2962FF' }}>

            <Grid.Column width={10} textAlign="center">
              <span className="feature">Refine your search based on various filters.</span>
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
                <div className="heading">Sort</div>
              </div>
            </Grid.Column>

            <Grid.Column width={10} textAlign="center">
              <span className="feature">Sort clubs by various data sets.</span>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

export default Landing;
