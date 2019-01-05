import React from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {connect} from 'react-redux';
// import {apiSetOwnerCryptedPassword} from 'ApiService/apiSetOwnerCryptedPassword';
import SubmitButton from '../SubmitButton';
import {documentActions} from '../../redux/actions/document';

class SharesList extends React.Component {
  state = {
    passwords: [],
  };

  submit = async (e, i, share) => {
    e.preventDefault();
    const password = this.state.passwords[i];
    if (!password || password.length === 0) {
      alert('Password can not be empty');
      return null;
    }
    if (password && password.length < 8) {
      alert('Password is too short (min 8 chars).');
      return null;
    }
    this.props.setCryptedPassword({shareId: share.id, password});
  };

  _renderPasswordForm = (share, i) => {
    if (!this.props.myShare || share.state !== 2) {
      return null;
    }
    return (
      <div>
        <form onSubmit={e => this.submit(e, i, share)} className='clearfix'>
          <FormGroup controlId={`password${i}`}>
            <ControlLabel>Enter sharing password</ControlLabel>
            <FormControl
              value={this.state.passwords[i]}
              type='password'
              placeholder='Enter password'
              onChange={e => this.setState({passwords: {...this.state.passwords, [i]: e.target.value}})}
            />
          </FormGroup>
          <SubmitButton isLoading={false} text='Submit' className=' ' />
        </form>
      </div>
    );
  };

  _renderShare = (share, i) => (
    <li key={i} className='li'>
      <div>
        <strong>Id: </strong>
        {share.id}
      </div>
      <div>
        <strong>State: </strong>
        {share.state}
      </div>
      {this._renderPasswordForm(share, i)}
    </li>
  );

  _renderShares = () => this.props.shares.map(this._renderShare);

  render() {
    const {shares} = this.props;
    if (!shares || shares.length === 0) {
      return <h4>The list is empty.</h4>;
    }
    return <ol>{this._renderShares()}</ol>;
  }
}

const mapDispatchToProps = dispatch => ({
  setCryptedPassword: (shareId, password) => dispatch(documentActions.setCryptedPassword(shareId, password)),
});

export default connect(
  null,
  mapDispatchToProps,
)(SharesList);
