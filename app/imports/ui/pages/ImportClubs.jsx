/* eslint-disable no-console */
/* global window */
import React from 'react';
import { Clubs } from '/imports/api/club/club';
import { Tags } from '/imports/api/tags/tags';
import { Grid, Header, Form, Segment, TextArea, Button, Modal, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import 'setimmediate';
import { Buffer } from 'buffer/';
import CSVParse from 'csv-parse';

/** Renders the Page for adding a document. */
class ImportClubs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      showModal: false,
      status: 'wait',
      totalCount: 0,
      successCount: 0,
      errorCount: 0,
      errorObject: undefined,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    // Changing this and calling forceUpdate() causes
    this.modalKey = 0;

    // Hacky way to enable Buffer to be used by csv-parse
    window.Buffer = Buffer;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ showModal: true, status: 'read' });

    setTimeout(() => {
      this.submit();
    }, 100);
  }

  /** On submit, insert the data. */
  submit() {
    const importClubs = [];
    const parser = CSVParse({ columns: true });
    const self = this;
    const randomTags = [
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
    const tags = new Map();
    const stats = {
      clubs: { success: 0, fail: 0 },
      tags: { success: 0, fail: 0 },
    };

    const checkProcessFinish = () => {
      if (stats.tags.success + stats.tags.fail < tags.size) {
        return;
      }

      this.setState({ status: 'done' });
    };

    function processTags() {
      self.setState({ status: 'tag' });
      self.modalKey++;
      self.forceUpdate();
      checkProcessFinish();

      for (const [tagName, clubs] of tags) {
        const tag = Tags.findOne({ name: tagName });

        if (tag !== undefined) {
          const newClubs = tag.clubs.concat(clubs);
          Tags.update(tag._id, { $set: { clubs: newClubs } }, (error) => {
            if (error) {
              console.error('Failed to update tag', tagName, error);
              stats.tags.fail++;
            } else {
              stats.tags.success++;
            }

            checkProcessFinish();
          });
        } else {
          Tags.insert({
            name: tagName,
            clubs: clubs,
            users: [],
          }, (error) => {
            if (error) {
              console.error('Failed to create tag', tagName, error);
              stats.tags.fail++;
            } else {
              stats.tags.success++;
            }

            checkProcessFinish();
          });
        }
      }
    }

    function checkInsertFinish() {
      if (stats.clubs.success + stats.clubs.fail < importClubs.length) {
        return;
      }

      processTags();
    }

    parser.on('readable', () => {
      let record = parser.read();
      while (record) {
        importClubs.push(record);

        record = parser.read();
      }
    });
    parser.on('finish', () => {
      if (this.state.status === 'error') {
        return;
      }
      this.setState({ status: 'import', totalCount: importClubs.length });
      this.modalKey++;
      this.forceUpdate();
      checkInsertFinish();

      for (let i = 0; i < importClubs.length; i++) {
        const owner = Meteor.user().username;
        const club = importClubs[i];
        const numberOfTags = Math.floor(Math.random() * (randomTags.length));
        const availableTags = randomTags.slice();
        const clubTags = [];

        for (let j = 0; j < numberOfTags; j++) {
          const tag = Math.floor(Math.random() * (availableTags.length - 1));

          clubTags.push(availableTags[tag]);
          availableTags.splice(tag, 1);
        }

        Clubs.insert({
          name: club['Name of Organization'],
          description: club['Name of Organization'],
          type: club.Type.length === 0 ? 'No Type Specified' : club.Type,
          tags: clubTags.slice(),
          rioEmail: club['RIO Email'] !== '' ? club['RIO Email'] : undefined,
          contactName: club['Contact Person'],
          contactEmail: club.Email,
          website: club['RIO Website'] !== '' ? club['RIO Website'] : undefined,
          owner,
          active: true,
          created: Date.now(),
        }, (error, _id) => {
          if (error) {
            console.error('Failed to create club', club, error);
            this.setState({ errorCount: ++stats.clubs.fail });
          } else {
            this.setState({ successCount: ++stats.clubs.success });

            for (let j = 0; j < clubTags.length; j++) {
              let tagArray = [_id];

              if (tags.has(clubTags[j])) {
                tagArray = tags.get(clubTags[j]);

                tagArray.push(_id);
              }

              tags.set(clubTags[j], tagArray);
            }

            checkInsertFinish();
          }
        });
      }
    });
    parser.on('error', function (error) {
      self.setState({ status: 'error', errorObject: error });
      self.forceUpdate();
      console.error('Failed to parse CSV', error);
    });
    parser.write(this.state.value);
    parser.end();
  }

  handleModalClose() {
    this.setState({
      showModal: false,
      status: 'wait',
      totalCount: 0,
      successCount: 0,
      errorCount: 0,
      errorObject: undefined,
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let status = '';

    if (this.state.status === 'wait') {
      status = 'Waiting for input...';
    } else if (this.state.status === 'read') {
      status = 'Reading CSV...';
    } else if (this.state.status === 'import') {
      status = `Importing RIOs... (${this.state.successCount}/${this.state.totalCount}) (${this.state.errorCount} failed)`;
    } else if (this.state.status === 'tag') {
      status = 'Processing tags...';
    } else if (this.state.status === 'done') {
      status = `Successfully imported ${this.state.successCount} RIOs (${this.state.errorCount} failed)`;
    } else if (this.state.status === 'error') {
      status = [
          'Error occurred parsing CSV!',
          <br key={1} />,
          this.state.errorObject.message,
      ];
    }

    const loader = ((this.state.status === 'done' || this.state.status === 'error')
        ? <div style={{ marginTop: '43px', textAlign: 'center' }}>
          {status}
        </div> : <Loader active inverted>{status}</Loader>);

    return (
        <Grid container centered className="content">
          <Grid.Column>
            <Header as="h2" textAlign="center">Import RIOs</Header>
            <Form onSubmit={this.handleSubmit}>
              <Segment>
                Copy and paste the contents of a CSV file downloaded from the list of approved RIOs:
                <TextArea name='csv' onChange={this.handleChange}
                          style={{ margin: '15px 0', fontFamily: 'monospace' }}/>
                <Button type="submit" color="green">Import</Button>
              </Segment>
            </Form>
          </Grid.Column>
          <Modal key={`modal-${this.modalKey}`} dimmer="inverted" open={this.state.showModal} closeOnEscape={false}
                 closeOnDimmerClick={false}style={{ position: 'fixed', top: '50%', left: '50%', marginTop: 0,
            transform: 'translate(-50%, -50%)' }}>
            <Modal.Header key={`header-${this.modalKey}`}>
              {this.state.status === 'done' ? 'Import Complete' :
                  (this.state.status === 'error' ? 'Error Occurred' : 'Importing RIOs')}
              </Modal.Header>
            <Modal.Content key={`content-${this.modalKey}`}>
              <Segment style={{ height: '100px' }}>
                {loader}
              </Segment>
            </Modal.Content>
            <Modal.Actions>
              <Button positive disabled={this.state.status !== 'done' && this.state.status !== 'error'} content="Close"
                      onClick={this.handleModalClose} />
            </Modal.Actions>
          </Modal>
        </Grid>
  );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Interest documents.
  const subscription = Meteor.subscribe('Tags');
  return {
    ready: subscription.ready(),
  };
})(ImportClubs);
