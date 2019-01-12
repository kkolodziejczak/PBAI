import React from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {connect} from 'react-redux';
// import {apiSetOwnerCryptedPassword} from 'ApiService/apiSetOwnerCryptedPassword';
import SubmitButton from '../SubmitButton';
import {documentActions} from '../../redux/actions/document';

class SharesList extends React.Component {
  state = {
    passwords: [],
    timers: [],
    timerSet: false,
  };

  submitPassword = async (e, i, share) => {
    e.preventDefault();
    const password = this.state.passwords[i];
    if (!password || password.length === 0) {
      alert('Password can not be empty');
      return null;
    }
    if (password && password.length < 3) {
      alert('Password is too short (min 3 chars).');
      return null;
    }
    this.props.setCryptedPassword({shareId: share.id, password});
  };

  submitTimer = async (e, i, share) => {
    e.preventDefault();
    const timer = this.state.timers[i];
    if (!timer || timer.length === 0) {
      alert('Timer can not be empty');
      return null;
    }
    if (timer && typeof parseInt(timer) !== 'number') {
      alert('Timer must be integer.');
      return null;
    }
    this.setState({timerSet: true});
    this.props.getTimer({permissionId: share.permissionId, timer});
  };

  _renderPasswordForm = (share, i) => {
    if (!this.props.myShare || share.state !== 2) {
      return null;
    }
    return (
      <div>
        <form onSubmit={e => this.submitPassword(e, i, share)} className="clearfix">
          <FormGroup controlId={`password${i}`}>
            <ControlLabel>Enter sharing password (must be equal to upload password)</ControlLabel>
            <FormControl
              value={this.state.passwords[i]}
              type="password"
              placeholder="Enter password"
              onChange={e => this.setState({passwords: {...this.state.passwords, [i]: e.target.value}})}
            />
          </FormGroup>
          <SubmitButton isLoading={false} text="Submit" className=" " />
        </form>
      </div>
    );
  };

  _renderTimerForm = (share, i) => {
    const {timers, myShare} = this.props;
    if (timers && !!timers.filter(timer => timer.permissionId === share.permissionId)[0]) {
      return null;
    }
    if (!share.permissionId) {
      return null;
    }
    if (!myShare || share.state !== 3) {
      return null;
    }
    return (
      <div>
        <form onSubmit={e => this.submitTimer(e, i, share)} className="clearfix">
          <FormGroup controlId={`timer${i}`}>
            <ControlLabel>Enter expiration time for the document (in seconds)</ControlLabel>
            <FormControl
              value={this.state.timers[i]}
              placeholder="Enter time"
              onChange={e => this.setState({timers: {...this.state.timers, [i]: e.target.value}})}
            />
          </FormGroup>
          <SubmitButton isLoading={false} text="Submit" className=" " />
        </form>
      </div>
    );
  };

  _renderSuccess = share => {
    if (!share.content) {
      return null;
    }
    return (
      <div>
        <strong style={{color: 'green'}}>SUCCESS!</strong>
        <strong style={{marginLeft: 20}}>Encrypted share content:</strong>
        {share.content}
      </div>
    );
  };

  getShareMessage(share) {
    const {myShare} = this.props;
    const {state, permissionId} = share;
    if (myShare) {
      if (state === 1) {
        return "You shared the document and send your public key. Waiting for partner's public key...";
      }
      if (state === 3 && !permissionId) {
        return "You just sent password for the file to your partner. It was encrypted with Diffie Hellman's Algorithm ";
      }
      if (state === 3 && this.state.timerSet) {
        return 'You just set an expiration time for the file.';
      }
      return '';
    }
    if (state === 2) {
      return "You just sent your public key. Waiting for the file owner's action...";
    }
    if (state === 3 && share.content) {
      return "You decrypted the file password with your private key and the sender's public key. Below you can see the content.";
    }
  }

  _renderShare = (share, i) => (
    <li key={i} className="li">
      <div>
        <strong>Id: </strong>
        {share.id}
      </div>
      <div>
        <strong>State: </strong>
        {share.state} <strong style={{marginLeft: 20, color: 'blue'}}>{this.getShareMessage(share)}</strong>
      </div>
      {this._renderPasswordForm(share, i)}
      {this._renderTimerForm(share, i)}
      {this._renderSuccess(share)}
    </li>
  );

  _renderShares = () => this.props.shares.map(this._renderShare);

  render() {
    const {shares} = this.props;
    if (!shares || shares.length === 0 || typeof shares[0] === 'string') {
      return <h4>The list is empty.</h4>;
    }
    return <ol>{this._renderShares()}</ol>;
  }
}

const mapStateToProps = ({document}) => ({timers: document.timers});

const mapDispatchToProps = dispatch => ({
  setCryptedPassword: (shareId, password) => dispatch(documentActions.setCryptedPassword(shareId, password)),
  getTimer: payload => dispatch(documentActions.getTimer(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SharesList);
