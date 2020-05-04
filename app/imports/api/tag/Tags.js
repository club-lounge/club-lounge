import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Tags = new Mongo.Collection('Tags');

/** Define a schema to specify the structure of each document in the collection. */
const TagSchema = new SimpleSchema({
  _id: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Tags.attachSchema(TagSchema);

/** Make the collection and schema available to other code. */
export { Tags, TagSchema };
