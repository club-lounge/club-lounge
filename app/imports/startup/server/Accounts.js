import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profile/Profiles';

/* eslint-disable no-console */

// TODO no additional parameter for firstname, lastName | those 2 param. performs no action
function createUser(email, password, role, first, last, image) {
  console.log(`  Creating user ${email} [${first} ${last}].`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.addUsersToRoles(userID, 'admin');
  }
  Profiles.insert({ _id: email, firstName: first, lastName: last, image: image });
}

/** When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ firstName, lastName, email, password, role, image }) => createUser(
        email, password, role, firstName, lastName, image,
    ));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
