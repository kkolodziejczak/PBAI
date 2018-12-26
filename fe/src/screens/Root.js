import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import NotFoundScreen from './NotFoundScreen';

class Root extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginScreen} />
          <Route exact path="/main" component={MainScreen} />
          <Route path="*" component={NotFoundScreen} />
        </Switch>
      </Router>
    );
  }
}

export default Root;
