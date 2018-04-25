import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Icon, Dropdown } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    return (
      <Menu attached="top" borderless inverted>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Header inverted as='h1'>Campus Cloud</Header>
        </Menu.Item>
        <Menu.Item as={NavLink} activeClassName="active" exact to="/list" key='list'>Browse RIOs</Menu.Item>
        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <Menu.Item as={NavLink} activeClassName="active" exact to="/import" key='import'>Import RIOs</Menu.Item>
        ) : ''}
        {this.props.currentUser === '' ? (
          <Menu.Item as={NavLink} position="right" activeClassName="active" exact to="/signin" key='signin'>
            Login <Icon name="user" style={{ margin: '0 0 0 0.35714286em' }}/>
          </Menu.Item>
        ) : (
          <Menu.Item position="right">
            <Dropdown text={this.props.currentUser} pointing="top right"
                      icon={<Icon name="user" style={{ margin: '0 0 0 0.35714286em' }}/>}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="User Page" as={NavLink} exact to="/user"/>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
