import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Contacts } from '../../api/contact/Contacts';
import { Events } from '../../api/event/Events';
import { Notes } from '../../api/note/Notes';
import { Requests } from '../../api/requests/Requests';
import { Clubs } from '../../api/club/Clubs';

Meteor.publish('Contacts', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Contacts.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('ContactsAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Contacts.find();
  }
  return this.ready();
});

Meteor.publish('Notes', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Notes.find({ owner: username });
  }
  return this.ready();
});

/* This shows all the events */
Meteor.publish('Events', function publish() {
  if (this.userId) {
    return Events.find();
  }
  return this.ready();
});

/* This should show all the clubs */
Meteor.publish('Clubs', function publish() {
  if (this.userId) {
    return Clubs.find();
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('Requests', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Requests.find();
  }
  return this.ready();
});
