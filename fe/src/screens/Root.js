import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from 'redux/store';
import rootSaga from 'redux/sagas/index';
import * as screen from './index';
import * as route from 'constants/routes';

store.runSaga(rootSaga);

class Root extends React.Component {
  _renderRouter = () => (
    <Router>
      <Switch>
        <Route exact path={route.ROUTE_LOGIN} component={screen.LoginScreen} />
        <Route exact path={route.ROUTE_REGISTER} component={screen.RegisterScreen} />
        <Route exact path={route.ROUTE_DASHBOARD} component={screen.DashboardScreen} />
        <Route path="*" component={screen.NotFoundScreen} />
      </Switch>
    </Router>
  );

  render() {
    return <Provider store={store}>{this._renderRouter()}</Provider>;
  }
}

export default Root;
