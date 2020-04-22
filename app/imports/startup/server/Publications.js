import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Events } from '../../api/event/Events';
import { Creates } from '../../api/create/Creates';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import { Registrants } from '../../api/register/Registrants';
import { ClubInfo } from '../../api/club_info/ClubInfo';

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

Meteor.publish('ClubInfo', function publish() {
  if (this.userId) {
    return ClubInfo.find();
  }
  return this.ready();
});

Meteor.publish('Creates', function publish() {
  if (this.userId) {
    return Creates.find();
  }
  return this.ready();
});

Meteor.publish('Members', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Members.find({ member: username });
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
