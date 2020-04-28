import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Profiles = new Mongo.Collection('Profiles');

/** Define a schema to specify the structure of each document in the collection. */
const ProfilesSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  _id: String,
  image: { type: String, optional: true, defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQT7NvIfTyhEXEDqrGjBe6Vaak8FpF2sOThf6pkUGkhdvPeYJ-A&usqp=CAU' },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfilesSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfilesSchema };
