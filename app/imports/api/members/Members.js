import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Members = new Mongo.Collection('Members');

/** Define a schema to specify the structure of each document in the collection. */
const MemberSchema = new SimpleSchema({
  member: String,
  club: String,
  role: { type: String, defaultValue: 'member', allowedValues: ['member', 'officer', 'owner'] },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Members.attachSchema(MemberSchema);

/** Make the collection and schema available to other code. */
export { Members, MemberSchema };
