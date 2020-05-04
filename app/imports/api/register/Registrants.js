import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Registrants = new Mongo.Collection('Registrants');

/** Define a schema to specify the structure of each document in the collection. */
const RequestsSchema = new SimpleSchema({
  event: String,
  email: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Registrants.attachSchema(RequestsSchema);

/** Make the collection and schema available to other code. */
export { Registrants, RequestsSchema };
