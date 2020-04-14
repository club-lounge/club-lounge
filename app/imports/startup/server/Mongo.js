import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/event/Events';
import { Creates } from '../../api/create/Creates';
import { Clubs } from '../../api/club/Clubs';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addEvent(data) {
  console.log(`  Adding: ${data.eventName} (${data.clubName})`);
  Events.insert(data);
}

/** Initialize the collection if empty. */
if (Events.find().count() === 0) {
  if (Meteor.settings.defaultEvents) {
    console.log('Creating events data.');
    Meteor.settings.defaultEvents.map(data => addEvent(data));
  }
}

/** Initialize the database with a default data document. */
function addRequest(data) {
  console.log(`  Adding: ${data.clubName}'s request`);
  Creates.insert(data);
}

/** Initialize the collection if empty. */
if (Creates.find().count() === 0) {
  if (Meteor.settings.defaultRequests) {
    console.log('Creating club request data.');
    Meteor.settings.defaultRequests.map(data => addRequest(data));
  }
}

function addClub(data) {
  console.log(`  Adding: ${data.clubName}`);
  Clubs.insert(data);
}

if (Clubs.find().count() === 0) {
  if (Meteor.settings.defaultClub) {
    console.log('Creating clubs data.');
    Meteor.settings.defaultClub.map(data => addClub(data));
  }
}
