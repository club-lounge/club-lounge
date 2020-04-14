import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Creates = new Mongo.Collection('Creates');

/** Define a schema to specify the structure of each document in the collection. */
const CreatesSchema = new SimpleSchema({
  clubName: String,
  clubEmail: String,
  image: String,
  description: String,
  clubWeb: String,
  owner: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Creates.attachSchema(CreatesSchema);

/** Make the collection and schema available to other code. */
export { Creates, CreatesSchema };
