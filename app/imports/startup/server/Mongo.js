import { Meteor } from 'meteor/meteor';
import { Contacts } from '../../api/contact/Contacts';
import { Events } from '../../api/event/Events';
import { Requests } from '../../api/requests/Requests';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addContact(data) {
  console.log(`  Adding: ${data.lastName} (${data.owner})`);
  Contacts.insert(data);
}

/** Initialize the collection if empty. */
if (Contacts.find().count() === 0) {
  if (Meteor.settings.defaultContacts) {
    console.log('Creating contact data.');
    Meteor.settings.defaultContacts.map(data => addContact(data));
  }
}

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
  console.log(`  Adding: ${data.lastName}'s request`);
  Requests.insert(data);
}

/** Initialize the collection if empty. */
if (Requests.find().count() === 0) {
  if (Meteor.settings.defaultRequests) {
    console.log('Creating events data.');
    Meteor.settings.defaultRequests.map(data => addRequest(data));
  }
}
