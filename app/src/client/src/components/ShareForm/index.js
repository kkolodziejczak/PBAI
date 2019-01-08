import React from 'react';
import {FormGroup, ControlLabel, HelpBlock, FormControl} from 'react-bootstrap';
import {connect} from 'react-redux';
import {documentActions} from 'redux/actions/document';
import SubmitButton from '../SubmitButton';
import FormWrapper from '../FormWrapper';

class ShareForm extends React.Component {
  state = {
    login: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.props.next();
    }
  }

  submit = e => {
    e.preventDefault();
    const id = this.props.doc.id;
    if (!id) {
      alert('There is no document id');
      return null;
    }
    const {login} = this.state;
    this.props.submit({id, login});
    this.props.setName(login);
  };

  _renderInput() {
    const {error} = this.props;
    return (
      <FormGroup style={{marginTop: 20}} controlId='login' validationState={error && error.login ? 'error' : null}>
        <ControlLabel>Document receiver login</ControlLabel>
        <FormControl
          value={this.state.login}
          placeholder='Enter login'
          onChange={e => this.setState({login: e.target.value})}
        />
        {error && error.login && (
          <HelpBlock>
            <span className='error'>{error.login}</span>
          </HelpBlock>
        )}
      </FormGroup>
    );
  }

  render() {
    const {isLoading, doc} = this.props;
    return (
      <FormWrapper>
        <h2>Add your partner login and share the document ({doc.name})</h2>
        <form
          onSubmit={this.submit}
          className='clearfix'
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          {this._renderInput()}
          <SubmitButton loading={isLoading} text='Share' />
        </form>
      </FormWrapper>
    );
  }
}

const mapStateToProps = ({document}) => ({
  error: document.documentShareError,
  isLoading: document.documentShareLoading,
  success: document.documentShareSuccess,
});

const mapDispatchToProps = dispatch => ({
  submit: payload => dispatch(documentActions.documentShareRequest(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShareForm);
