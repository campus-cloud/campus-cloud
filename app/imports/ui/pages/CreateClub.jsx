import React from 'react';
import { Clubs, ClubSchema } from '/imports/api/club/club';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import HiddenField from 'uniforms-semantic/HiddenField';
import { Bert } from 'meteor/themeteorchef:bert';

/** Renders the Page for adding a document. */
class CreateClub extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
      this.formRef.reset();
    }
  }

  /** On submit, insert the data. */
  submit(data) {
    const { name, type, image, description, rioEmail, contactName, contactEmail, website } = data;
    Clubs.insert({ name, type, image, description, rioEmail, contactName, contactEmail, website, tags: [], active: true, created: Date.now() }, this.insertCallback);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <Grid container centered className="content">
          <Grid.Column>
            <Header as="h2" textAlign="center">Create RIO</Header>
            <AutoForm ref={(ref) => { this.formRef = ref; }} schema={ClubSchema} onSubmit={this.submit}>
              <Segment>
                <TextField name='name'/>
                <TextField name='type'/>
                <TextField name='image'/>
                <LongTextField name='description'/>
                <TextField name='rioEmail'/>
                <TextField name='contactName'/>
                <TextField name='contactEmail'/>
                <TextField name='website'/>
                <HiddenField name='tags' value='true'/>
                <HiddenField name='active' value='true'/>
                <HiddenField name='created' value='0'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateClub;
