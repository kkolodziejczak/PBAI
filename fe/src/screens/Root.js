import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import store from 'redux/store';
import NotFoundScreen from './NotFoundScreen';

class Root extends React.Component {
  _renderRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginScreen} />
        <Route exact path="/main" component={MainScreen} />
        <Route path="*" component={NotFoundScreen} />
      </Switch>
    </Router>
  );

  render() {
    return <Provider store={store}>{this._renderRouter()}</Provider>;
  }
}

export default Root;
