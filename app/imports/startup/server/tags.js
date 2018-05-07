import { Meteor } from 'meteor/meteor';
import { Tags } from '../../api/tags/tags';


/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: Tag (${data.name})`);
  Tags.insert(data);
}

/** Initialize the collection if empty. */
if (Tags.find().count() === 0) {
  if (Meteor.settings.defaultTags) {
    console.log('Creating default tags.');
    Meteor.settings.defaultTags.map(data => addData(data));
  }
}


/** This subscription publishes all documents regardless of user */
Meteor.publish('Tags', function publish() {
    return Tags.find();
});
