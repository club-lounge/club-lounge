import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Events } from '../../api/event/Events';
import { Requests } from '../../api/requests/Requests';
import { Clubs } from '../../api/club/Clubs';
import { Registrants } from '../../api/register/Registrants';

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

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('Registrants', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Registrants.find();
  }
  return this.ready();
});
