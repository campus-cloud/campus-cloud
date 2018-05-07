import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Tags = new Mongo.Collection('tags');

/** Create a schema to constrain the structure of documents associated with this collection. */
const TagsSchema = new SimpleSchema({
  name: String,
  clubs: [String],
  users: [String],
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Tags.attachSchema(TagsSchema);

/** Make the collection and schema available to other code. */
export { Tags, TagsSchema };
