import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import {ROUTE_LOGIN} from 'constants/routes';
import NavMenu from 'components/NavMenu';
import UploadForm from 'components/UploadForm';
import ShareForm from 'components/ShareForm';
import ScreenWrapper from 'components/ScreenWrapper';

class DashboardScreenComponent extends React.Component {
  state = {
    step: 1,
  };

  nextStep = () => this.setState(prevState => ({step: prevState.step + 1}));

  componentDidMount() {
    const {clearLoginForm, clearRegisterForm, isLoggedIn, history} = this.props;
    clearLoginForm();
    clearRegisterForm();
    if (!isLoggedIn) {
      history.push(ROUTE_LOGIN);
    }
  }

  _renderContent() {
    switch (this.state.step) {
      case 1:
        return <UploadForm next={this.nextStep} />;
      case 2:
        return <ShareForm next={this.nextStep} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <React.Fragment>
        <NavMenu />
        <ScreenWrapper title={`Document sharing (step ${this.state.step})`} titleCenter>
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
});

const DashboardScreen = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DashboardScreenComponent);

export {DashboardScreen};
