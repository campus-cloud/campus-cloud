import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/club/club';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Clubs.insert(data);
}

/** Initialize the collection if empty. */
if (Clubs.find().count() === 0) {
  if (Meteor.settings.defaultClubs) {
    console.log('Creating default clubs.');
    Meteor.settings.defaultClubs.map(data => addData(data));
  }
}

/** This subscription publishes all documents regardless of user */
Meteor.publish('Clubs', function publish() {
    return Clubs.find();
});
