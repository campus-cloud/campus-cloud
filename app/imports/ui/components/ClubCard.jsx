import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Button, Label } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** Renders a single card in the RIO list. See pages/ListClubs.jsx. */
class ClubCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = { active: props.club.active };

    this.handleActivate = this.handleActivate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.activateRef = null;
    this.deleteRef = null;
  }

  // Prevent card from updating unless it's contents have changed or the width changed
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.club.name !== nextProps.club.name) {
      return true;
    }
    if (this.props.width !== nextProps.width) {
      return true;
    }
    if (this.state.active !== nextState.active) {
      return true;
    }

    return false;
  }

  handleActivate(event) {
    const club = this.props.club;
    const active = this.state.active;

    Clubs.update(club._id, { $set: { active: !active } }, (error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({ active: !active });
      }
    });
  }

  handleDelete(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    const DEFAULT_IMAGE = '/images/default-image.png';

    const buttonSpacerStyle = { width: '100%', height: '5px', margin: 0, padding: 0 };
    const tagStyle = { margin: '2px 3px 0 0', padding: '5px 6px', borderRadius: 0 };
    const cardStyle = { width: this.props.width, flexDirection: 'row' };
    const imageStyle = { width: '50px' };
    const detailContentStyle = { display: 'flex', width: 'calc(100% - 78px)', flexDirection: 'column', paddingLeft: 0,
      border: 0 };
    const metaStyle = { marginTop: '3px', marginLeft: 0 };
    const descriptionStyle = { marginBottom: '10px', flex: 1 };
    const buttonGroupStyle = { width: 'unset', marginLeft: '-64px' };

    if (!this.state.active) {
      cardStyle.background = '#E0E0E0';
    }

    const displayedButtons = [
        <Button key="view" as={Link} to={`/view/${this.props.club._id}`} fluid basic color="blue"
                className="view-button">View</Button>,
    ];

    // Add buttons for club owners
    if (Roles.userIsInRole(Meteor.userId(), 'club-owner') && this.props.club.owner === Meteor.user().username) {
      displayedButtons.push(<Button key="edit" as={Link} to={`/edit/${this.props.club._id}`} fluid basic color="green"
                                    className="edit-button">Edit</Button>);
    }

    // Add buttons for admins
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      displayedButtons.push(
          <Button ref={(ref) => { this.activateRef = ref; }} key="activate" fluid basic color="grey" className="activate-button" onClick={this.handleActivate}>{this.state.active ? 'Deactivate' : 'Activate'}</Button>,
          <Button ref={(ref) => { this.deleteRef = ref; }} key="delete" fluid basic color="red" className="delete-button" onClick={this.handleDelete}>Delete</Button>,
      );
    }

    const buttons = displayedButtons.length;

    // Add spacing between vertical buttons (only when there are more than two buttons)
    if (buttons >= 3) {
      for (let i = buttons - 1; i >= 1; i--) {
        displayedButtons.splice(i, 0, <div style={buttonSpacerStyle}/>);
      }
    }

    const tags = [];

    for (let i = 0; i < this.props.club.tags.length; i++) {
      tags.push(<Label as='a' key={this.props.club.tags[i]} style={tagStyle}>
        {this.props.club.tags[i]}
      </Label>);
    }

    return (
        <Card style={cardStyle}>
          <Card.Content style={{ flex: 'unset' }}>
            <img src={this.props.club.image || DEFAULT_IMAGE} style={imageStyle} />
          </Card.Content>
          <Card.Content style={detailContentStyle}>
            <Card.Header>
              {this.props.club.name}
            </Card.Header>
            <Card.Meta style={metaStyle}>
              {tags}
            </Card.Meta>
            <Card.Description style={descriptionStyle}>
              {this.props.club.description.length > 123 ? `${this.props.club.description.substring(0, 120)}...`
                  : this.props.club.description}
            </Card.Description>
            {buttons < 3 ?
                (<Button.Group widths={buttons} style={buttonGroupStyle}>
                  {(displayedButtons)}
                </Button.Group>)
                : (<div style={buttonGroupStyle}>
                  {(displayedButtons)}
                </div>)
            }
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubCard.propTypes = {
  club: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubCard);
