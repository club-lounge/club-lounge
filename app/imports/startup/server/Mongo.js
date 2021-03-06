import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/event/Events';
import { Creates } from '../../api/create/Creates';
import { Clubs } from '../../api/club/Clubs';
import { Members } from '../../api/members/Members';
import { Tags } from '../../api/tag/Tags';

/* eslint-disable no-console */

function addEvent(data) {
  let { start, end } = data;
  start = new Date(start);
  end = new Date(end);
  console.log(`\t\tAdding: ${data.eventName} (Club ID: ${data.club})`);
  Events.insert({ eventName: data.eventName, club: data.club, start: start, end: end, location: data.location,
    image: data.image, description: data.description, tags: data.tags });
}

function addRequest(data) {
  console.log(`\t\tAdding: ${data.clubName}'s request`);
  Creates.insert(data);
}

function addClub(data) {
  console.log(`\t\tAdding: ${data.clubName}`);
  Clubs.insert(data);
}

function addMember(data) {
  console.log(`\t\tAdding: ${data.member} to Club ID: (${data.club})`);
  Members.insert(data);
}

function addTag(data) {
  console.log(`\t\tAdding tag: ${data}`);
  Tags.insert({ _id: data });
}

/** data is empty */
if (Meteor.settings.loadAssetsFile) {
  if (Clubs.find().count() === 0 && Creates.find().count() === 0 && Events.find().count() === 0) {
    const assetsFileName = 'defaultData.json';
    console.log(`Loading data from private/${assetsFileName}`);
    const data = JSON.parse(Assets.getText(assetsFileName));
    // reading data from json file
    console.log('\tCreating default tag data');
    data.tags.map(e => addTag(e));
    console.log('\tCreating default club data');
    data.club.map(e => addClub(e));
    console.log('\tCreating default member data');
    data.member.map(e => addMember(e));
    console.log('\tCreating default request data');
    data.request.map(e => addRequest(e));
    console.log('\tCreating default event data');
    data.event.map(e => addEvent(e));
  }
}
