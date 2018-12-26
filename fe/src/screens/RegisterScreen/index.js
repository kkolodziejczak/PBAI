import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ScreenWrapper from 'components/ScreenWrapper';
import {ROUTE_LOGIN} from 'constants/routes';

class RegisterScreen extends React.Component {
  state = {
    login: '',
    password: '',
    password_confirmation: '',
  };

  submit = e => {
    e.preventDefault();
  };

  handleChange(key, e) {
    this.setState({[key]: e.target.value});
  }

  _renderFooter = () => (
    <span>
      Go to <Link to={ROUTE_LOGIN}>login</Link>
    </span>
  );

  render() {
    const {login, password, password_confirmation} = this.state;
    return (
      <ScreenWrapper title="Register" titleCenter maxWidth={500}>
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
          <FormGroup controlId="password">
            <ControlLabel>Confirm password</ControlLabel>
            <FormControl
              type="text"
              value={password_confirmation}
              placeholder="Repeat password"
              onChange={e => this.handleChange('password_confirmation', e)}
            />
            <FormControl.Feedback />
          </FormGroup>
          <Button type="submit" bsStyle="primary" className="pull-right">
            Submit
          </Button>
        </form>
        {this._renderFooter()}
      </ScreenWrapper>
    );
  }
}

export {RegisterScreen};
