import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubCard extends React.Component {
  render() {
    return (
        <Card centered>
          <Card.Content>
            <Card.Header>
              {this.props.club.name}
            </Card.Header>
            <Image centered size='large' src={this.props.club.image} style={{ padding: '10px 0' }} />
            <Card.Meta>Tags: {this.props.club.tags.length > 0 ? this.props.club.tags.join(', ') : 'None'}</Card.Meta>
            <Card.Description>{this.props.club.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/view/${this.props.club._id}`}>View</Link>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/view/${this.props.club._id}`}>Deactivate</Link>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/view/${this.props.club._id}`}>Delete</Link>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubCard.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubCard);
