import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import getStoreInstance from 'redux/store';
import rootSaga from 'redux/sagas/index';
import * as screen from './index';
import * as route from 'constants/routes';

const {store, persistor} = getStoreInstance();
store.runSaga(rootSaga);

class Root extends React.Component {
  _renderRouter = () => (
    <Router>
      <Switch>
        <Route exact path={route.ROUTE_LOGIN} component={screen.LoginScreen} />
        <Route exact path={route.ROUTE_REGISTER} component={screen.RegisterScreen} />
        <Route exact path={route.ROUTE_DASHBOARD} component={screen.DashboardScreen} />
        <Route exact path={route.ROUTE_DOCUMENTS} component={screen.DocumentsScreen} />
        <Route exact path={route.ROUTE_LOGS} component={screen.LogsScreen} />
        <Route exact path={route.ROUTE_SHARES} component={screen.SharesScreen} />
        <Route exact path={route.ROUTE_DB} component={screen.DbScreen} />
        <Route path='*' component={screen.NotFoundScreen} />
      </Switch>
    </Router>
  );

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {this._renderRouter()}
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;
