/* global window */
import React from 'react';
import { Clubs } from '/imports/api/club/club';
import { Grid, Header, Form, Segment, TextArea, Button } from 'semantic-ui-react';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import 'setimmediate';
import { Buffer } from 'buffer/';
import CSVParse from 'csv-parse';

/** Renders the Page for adding a document. */
class ImportClubs extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;

    // Hacky way to enable Buffer to be used by csv-parse
    window.Buffer = Buffer;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  /** On submit, insert the data. */
  handleSubmit(event) {
    const clubs = [];
    const parser = CSVParse({ columns: true });
    const self = this;
    const tags = [
        'foo',
        'bar',
        'baz',
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet',
    ];

    parser.on('readable', function () {
      let record = parser.read();
      while (record) {
        clubs.push(record);

        record = parser.read();
      }
    });
    parser.on('finish', function () {
      for (let i = 0; i < clubs.length; i++) {
        const owner = Meteor.user().username;
        const club = clubs[i];
        const numberOfTags = Math.floor(Math.random() * (tags.length));
        const availableTags = tags.slice();
        const clubTags = [];

        clubTags.push(club.Type);
        for (let j = 0; j < numberOfTags; j++) {
          const tag = Math.floor(Math.random() * (availableTags.length - 1));

          clubTags.push(availableTags[tag]);
          availableTags.splice(tag, 1);
        }

        Clubs.insert({
          name: club['Name of Organization'],
          description: club['Name of Organization'],
          type: club.Type,
          tags: clubTags,
          rioEmail: club['RIO Email'] !== '' ? club['RIO Email'] : undefined,
          contactName: club['Contact Person'],
          contactEmail: club.Email,
          website: club['RIO Website'] !== '' ? club['RIO Website'] : undefined,
          owner,
          active: true,
          created: Date.now(),
        }, self.insertCallback);
      }

      Bert.alert({ type: 'success', message: `Imported ${clubs.length} RIOs` });
    });
    parser.on('error', function (error) {
      Bert.alert({ type: 'danger', message: 'An error occurred importing the CSV!' });
      console.log(error);
    });
    parser.write(this.state.value);
    parser.end();
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    }
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <Grid container centered className="content">
          <Grid.Column>
            <Header as="h2" textAlign="center">Import RIOs</Header>
            <Form ref={(ref) => { this.formRef = ref; }} onSubmit={this.handleSubmit}>
              <Segment>
                Copy and paste the contents of a CSV file downloaded from the list of approved RIOs:
                <TextArea name='csv' onChange={this.handleChange} style={{ margin: '15px 0', fontFamily: 'monospace' }}/>
                <Button type="submit" color="green">Import</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
    );
  }
}

export default ImportClubs;
