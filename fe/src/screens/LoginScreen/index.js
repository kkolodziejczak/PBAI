import React from 'react';
import Spinner from 'react-activity/lib/Spinner';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ScreenWrapper from 'components/ScreenWrapper';
import {ROUTE_REGISTER} from 'constants/routes';

class LoginScreen extends React.Component {
  state = {
    form: {
      login: '',
      password: '',
    },
  };

  submit = e => {
    e.preventDefault();
  };

  handleChange(key, e) {
    this.setState({form: {...this.state.form, [key]: e.target.value}});
  }

  _renderFooter = () => (
    <span>
      Don't have account yet? <Link to={ROUTE_REGISTER}>Register</Link>
    </span>
  );

  render() {
    const {login, password} = this.state.form;
    return (
      <ScreenWrapper title="Login" titleCenter maxWidth={500}>
        <form onSubmit={this.submit} className="clearfix">
          <FormGroup controlId="login">
            <ControlLabel>Login</ControlLabel>
            <FormControl
              type="text"
              value={login}
              placeholder="Enter login"
              onChange={e => this.handleChange('login', e)}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="password">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="text"
              value={password}
              placeholder="Enter password"
              onChange={e => this.handleChange('password', e)}
            />
            <FormControl.Feedback />
          </FormGroup>
          <Button type="submit" bsStyle="primary" className="pull-right">
            {this.props.loading ? <Spinner color="white" /> : 'Submit'}
          </Button>
        </form>
        {this._renderFooter()}
      </ScreenWrapper>
    );
  }
}

export {LoginScreen};
