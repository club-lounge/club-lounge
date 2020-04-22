import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const ClubInfo = new Mongo.Collection('ClubInfo');

/** Define a schema to specify the structure of each document in the collection. */
const ClubInfoSchema = new SimpleSchema({
  clubName: String,
  clubEmail: String,
  image: String,
  clubWeb: String,
  description: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ClubInfo.attachSchema(ClubInfoSchema);

/** Make the collection and schema available to other code. */
export { ClubInfo, ClubInfoSchema };
