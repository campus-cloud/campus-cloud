/* eslint-disable react/jsx-key */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** Renders a single card in the RIO list. See pages/ListClubs.jsx. */
class ClubCard extends React.Component {
  render() {
    const cardStyle = { width: 'calc(100% / 3 - 14px)', flexDirection: 'row' };
    const imageStyle = { margin: 'auto' };
    const detailContentStyle = { display: 'flex', flexDirection: 'column', paddingLeft: 0 };
    const descriptionStyle = { marginBottom: '10px', flex: 1 };

    const clubOwnerButtons = Roles.userIsInRole(Meteor.userId(), 'club-owner') && this.props.club.owner === Meteor.user().username ? ([
      <Button as={Link} to={`/edit/${this.props.club._id}`} fluid basic color='green'>Edit</Button>,
    ]) : '';
    const adminButtons = Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
      <Button fluid basic color='grey'>Deactivate</Button>,
      <Button fluid basic color='red'>Delete</Button>,
    ]) : '';
    const buttonGroupWidth = 1 + clubOwnerButtons.length + adminButtons.length;

    return (
        <Card style={cardStyle}>
          <Card.Content>
            <Image centered size='small' src={this.props.club.image} style={imageStyle} />
          </Card.Content>
          <Card.Content style={detailContentStyle}>
            <Card.Header>
              {this.props.club.name}
            </Card.Header>
            <Card.Meta>
              Tags: {this.props.club.tags.length > 0 ? this.props.club.tags.join(', ') : 'None'}
            </Card.Meta>
            <Card.Description style={descriptionStyle}>
              {this.props.club.description.length > 123 ? `${this.props.club.description.substring(0, 120)}...` : this.props.club.description}
            </Card.Description>
            <Button.Group vertical={buttonGroupWidth > 2} widths={buttonGroupWidth > 2 ? 1 : buttonGroupWidth}>
              <Button as={Link} to={`/view/${this.props.club._id}`} fluid basic color='blue'>View Details</Button>
              {clubOwnerButtons}
              {adminButtons}
            </Button.Group>
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
