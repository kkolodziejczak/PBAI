import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Button} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import {documentActions} from 'redux/actions/document';
import {ROUTE_LOGIN} from 'constants/routes';
import Dropzone from 'components/Dropzone';
import NavMenu from 'components/NavMenu';
import Spinner from 'react-activity/lib/Spinner';
import ScreenWrapper from 'components/ScreenWrapper';

class DashboardScreenComponent extends React.Component {
  dropzone = null;

  componentDidMount() {
    const {clearLoginForm, isLoggedIn, history} = this.props;
    clearLoginForm();
    if (!isLoggedIn) {
      history.push(ROUTE_LOGIN);
    }
  }

  submit = async e => {
    e.preventDefault();
    const file = this.dropzone.getFile();
    if (!file) {
      alert('Please upload a file.');
      return null;
    }
    const name = file.name;
    const reader = new FileReader();
    reader.onload = event => {
      const base64Stream = event.target.result.replace('data:text/plain;base64', '');
      this.props.documentSend({name, content: base64Stream});
    };
    reader.readAsDataURL(file);
  };

  render() {
    const {error, loading} = this.props;
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title="Share documents" titleCenter maxWidth={500}>
          <Dropzone ref={d => (this.dropzone = d)} />
          {error && (
            <div className="error" style={{textAlign: 'center', marginTop: 5, color: '#c66'}}>
              {error}
            </div>
          )}
          <form onSubmit={this.submit}>
            <Button type="submit" bsStyle="primary" className="pull-right" style={{marginRight: 100, marginTop: 20}}>
              {loading ? <Spinner color="white" /> : 'Submit'}
            </Button>
          </form>
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mamStateToProps = ({user, document}) => ({
  isLoggedIn: user.isLoggedIn,
  loading: document.documentSendLoading,
  error: document.documentSendError,
  success: document.documentSendSuccess,
});

const mapDispatchToProps = dispatch => ({
  clearLoginForm: () => dispatch(userActions.loginClear()),
  documentSend: payload => dispatch(documentActions.documentSendRequest(payload)),
});

const DashboardScreen = compose(
  withRouter,
  connect(
    mamStateToProps,
    mapDispatchToProps,
  ),
)(DashboardScreenComponent);

export {DashboardScreen};
