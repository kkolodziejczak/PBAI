import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import {ROUTE_LOGIN} from 'constants/routes';
import ScreenWrapper from 'components/ScreenWrapper';

class DashboardScreenComponent extends React.Component {
  componentDidMount() {
    const {clearLoginForm, isLoggedIn, history} = this.props;
    clearLoginForm();
    if (!isLoggedIn) {
      history.push(ROUTE_LOGIN);
    }
  }

  render() {
    return <ScreenWrapper title="Dashboard Screen">fgasgf</ScreenWrapper>;
  }
}

const mamStateToProps = ({user}) => ({
  isLoggedIn: user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  clearLoginForm: () => dispatch(userActions.loginClear()),
});

const DashboardScreen = compose(
  withRouter,
  connect(
    mamStateToProps,
    mapDispatchToProps,
  ),
)(DashboardScreenComponent);

export {DashboardScreen};
