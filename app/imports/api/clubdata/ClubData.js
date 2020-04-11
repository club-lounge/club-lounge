import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const ClubData = new Mongo.Collection('ClubData');

/** Define a schema to specify the structure of each document in the collection. */
const ClubsSchema = new SimpleSchema({
  clubName: String,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  clubWebsite: String,
  image: String,
  description: String,
  owner: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ClubData.attachSchema(ClubsSchema);

/** Make the collection and schema available to other code. */
export { ClubData, ClubsSchema };
