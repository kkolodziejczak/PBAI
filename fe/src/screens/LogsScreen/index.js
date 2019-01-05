import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router';
import ScreenWrapper from 'components/ScreenWrapper';
import NavMenu from 'components/NavMenu';
import {apiAdminGetLogs} from 'ApiService/admin/apiAdminGetLogs';

class LogsScreenComponent extends React.Component {
  state = {html: ''};
  frame = null;

  componentDidMount() {
    const {isAdmin, history} = this.props;
    if (!isAdmin) {
      history.goBack();
      return null;
    }
    this.getLogs();
  }

  getLogs = async () => {
    const {response: html} = await apiAdminGetLogs();
    this.setState({html});
    const document = this.frame.contentDocument;
    document.body.innerHTML = html;
  };

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='Logs' titleCenter>
          <iframe title='logs' ref={f => (this.frame = f)} className='frame' />
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({user}) => ({isAdmin: user.me.isAdmin});

const LogsScreen = compose(
  withRouter,
  connect(mapStateToProps),
)(LogsScreenComponent);

export {LogsScreen};
