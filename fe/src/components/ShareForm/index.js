import React from 'react';
// import {documentActions} from 'redux/actions/document';
import SubmitButton from '../SubmitButton';
import FormWrapper from '../FormWrapper';

class ShareForm extends React.Component {
  submit = () => {};

  _renderInput() {
    return null;
  }

  render() {
    return (
      <FormWrapper>
        <h2>Add your partner login and share the document</h2>
        <form
          onSubmit={this.submit}
          className='clearfix'
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          {this._renderInput()}
          <SubmitButton loading={false} text='Save and continue' />
        </form>
      </FormWrapper>
    );
  }
}

export default ShareForm;
