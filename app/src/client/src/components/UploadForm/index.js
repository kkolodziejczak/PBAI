import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {connect} from 'react-redux';
import {documentActions} from 'redux/actions/document';
import Dropzone from '../Dropzone';
import SubmitButton from '../SubmitButton';
import FormWrapper from '../FormWrapper';
import {base64encode, base64decode, encode} from 'helpers/index';

class UploadForm extends React.Component {
  state = {
    documentPassword: '',
    passwordError: null,
  };

  dropzone = null;

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.props.next();
    }
  }

  submit = async e => {
    e.preventDefault();
    const file = this.dropzone.getFile();
    if (!file) {
      alert('Please upload a file.');
      return null;
    }
    const {documentPassword} = this.state;
    if (!documentPassword || documentPassword.length === 0) {
      this.setState({passwordError: 'password can not be empty'});
      return null;
    }
    const reader = new FileReader();
    reader.onload = event => {
      const stream = event.target.result.replace('data:text/plain;base64,', '');
      const encodedBase64 = this.encodeFile(stream);

      this.props.documentSend({name: file.name, content: encodedBase64});
    };
    reader.readAsDataURL(file);
  };

  encodeFile = stream => {
    const decodedStream = base64decode(stream);
    const encoded = encode(decodedStream, this.state.documentPassword);
    return base64encode(encoded);
  };

  _renderError() {
    const {error} = this.props;
    if (!error) {
      return null;
    }
    let errorMsg = '';
    if (typeof error === 'string') {
      errorMsg = error;
    }
    if (typeof error === 'object') {
      const key = Object.keys(error)[0];
      errorMsg = `${key} ${error[key]}`;
    }
    return (
      <div className='error' style={{textAlign: 'center', marginTop: 5, color: '#c66'}}>
        {errorMsg}
      </div>
    );
  }

  _renderInput() {
    const {passwordError, documentPassword} = this.state;
    return (
      <FormGroup style={{marginTop: 20}} controlId='documentPassword' validationState={passwordError ? 'error' : null}>
        <ControlLabel>Password for uploaded document</ControlLabel>
        <FormControl
          value={documentPassword}
          type='password'
          placeholder='Enter password'
          onChange={e => this.setState({documentPassword: e.target.value, passwordError: null})}
        />
        {passwordError && (
          <HelpBlock>
            <span className='error'>{passwordError}</span>
          </HelpBlock>
        )}
      </FormGroup>
    );
  }

  render() {
    const {loading} = this.props;
    return (
      <FormWrapper>
        <h2>Upload a file and set its password</h2>
        <Dropzone ref={d => (this.dropzone = d)} />
        {this._renderError()}
        <form
          onSubmit={this.submit}
          className='clearfix'
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          {this._renderInput()}
          <SubmitButton loading={loading} text='Save and continue' />
        </form>
      </FormWrapper>
    );
  }
}

const mapStateToProps = ({document}) => ({
  loading: document.documentSendLoading,
  error: document.documentSendError,
  success: document.documentSendSuccess,
});

const mapDispatchToProps = dispatch => ({
  documentSend: payload => dispatch(documentActions.documentSendRequest(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadForm);
