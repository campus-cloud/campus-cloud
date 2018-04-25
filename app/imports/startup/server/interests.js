import { Meteor } from 'meteor/meteor';
import { Interests } from '../../api/interests/interests';


/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: Interests to (${data.owner})`);
  Interests.insert(data);
}

/** Initialize the collection if empty. */
if (Interests.find().count() === 0) {
  if (Meteor.settings.defaultInterests) {
    console.log('Creating default interests for default user.');
    Meteor.settings.defaultInterests.map(data => addData(data));
  }
}


/** This subscription publishes all documents regardless of user */
Meteor.publish('Interests', function publish() {
    return Interests.find();
});
