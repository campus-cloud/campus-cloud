import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable no-console */

function createUser(email, password, role, interests) {
  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
    interests: interests,
  });
  if (role) {
    Roles.addUsersToRoles(userID, role);
  }
}

/** When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
// eslint-disable-next-line max-len
    Meteor.settings.defaultAccounts.map(({ email, password, role, interests }) => createUser(email, password, role, interests));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
