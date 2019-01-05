import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import {ROUTE_LOGIN, ROUTE_DOCUMENTS} from 'constants/routes';
import NavMenu from 'components/NavMenu';
import UploadForm from 'components/UploadForm';
import ScreenWrapper from 'components/ScreenWrapper';
import UploadSuccess from 'components/UploadSuccess';
// import {apiDocumentGet} from 'ApiService/apiDocumentGet';

class DashboardScreenComponent extends React.Component {
  state = {
    step: 1,
  };

  nextStep = () => this.setState(prevState => ({step: prevState.step + 1}));

  componentDidMount() {
    const {clearLoginForm, clearRegisterForm, isLoggedIn, history, getUserData} = this.props;
    clearLoginForm();
    clearRegisterForm();
    if (!isLoggedIn) {
      history.push(ROUTE_LOGIN);
      return;
    }
    getUserData();
    // this.getDocument();
  }

  // getDocument = async () => {
  //   const document = await apiDocumentGet('5c30861f5b85d900190a2adc');
  //   console.log('document', document);
  // };

  _renderContent() {
    switch (this.state.step) {
      case 1:
        return <UploadForm next={this.nextStep} />;
      case 2:
        return <UploadSuccess onClick={() => this.props.history.push(ROUTE_DOCUMENTS)} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title='Document upload' titleCenter>
          {this._renderContent()}
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({user, document}) => ({
  isLoggedIn: user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  clearLoginForm: () => dispatch(userActions.loginClear()),
  clearRegisterForm: () => dispatch(userActions.registerClear()),
  getUserData: () => dispatch(userActions.getUserData()),
});

const DashboardScreen = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DashboardScreenComponent);

export {DashboardScreen};
