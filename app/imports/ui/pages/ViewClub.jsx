import React from 'react';
import { Container, Grid, Segment, Loader, Label, Header, Image } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditClub extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : (
        <Container className="content">
          <Segment style={{ height: '100px' }}>
            <Loader active>Loading data</Loader>
          </Segment>
        </Container>
    );
  }

  /** Render the page */
  renderPage() {
    const DEFAULT_IMAGE = '/images/default-image.png';

    const tags = [];

    for (let i = 0; i < this.props.club.tags.length; i++) {
      tags.push(<Label as='a' key={this.props.club.tags[i]} style={{ margin: '2px 3px 0 0', padding: '5px 6px', borderRadius: 0 }}>
        {this.props.club.tags[i]}
      </Label>);
    }

    return (
        <Container className="content">
          <Header as="h2" textAlign="center">{this.props.club.name}</Header>
          <Grid>
            <Grid.Column width={4}>
              <Image fluid src={this.props.club.image || DEFAULT_IMAGE}/>
              <Header as="h3" style={{ marginTop: '15px', marginBottom: '5px' }}>Contact Information:</Header>
              <div>
                <span style={{ fontWeight: 'bold' }}>Contact: </span>
                {this.props.club.contactName}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>Contact Email: </span>
                {this.props.club.contactEmail}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>RIO Email: </span>
                {this.props.club.rioEmail}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>RIO Website: </span>
                {this.props.club.website}
              </div>
              <div style={{ paddingTop: '15px' }}>
                {tags}
              </div>
            </Grid.Column>
            <Grid.Column width={12}>
              <div>
                {this.props.club.description}
              </div>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Require the presence of a Club document in the props object. */
EditClub.propTypes = {
  club: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    club: Clubs.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditClub);

