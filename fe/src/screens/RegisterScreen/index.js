import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button, HelpBlock} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import Spinner from 'react-activity/lib/Spinner';
import {connect} from 'react-redux';
import ScreenWrapper from 'components/ScreenWrapper';
import {ROUTE_LOGIN} from 'constants/routes';

class RegisterScreenComponent extends React.PureComponent {
  state = {
    form: {
      login: '',
      password: '',
      password_confirmation: '',
    },
  };

  get inputs() {
    return [
      {
        name: 'login',
        label: 'Login',
        type: 'text',
        placeholder: 'Enter login',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
      },
      {
        name: 'password_confirmation',
        label: 'Confirm password',
        type: 'password',
        placeholder: 'Repeat password',
      },
    ];
  }

  submit = e => {
    e.preventDefault();
    this.props.register(this.state.form);
    //TODO: handle submit success
  };

  handleChange(key, e) {
    this.setState({form: {...this.state.form, [key]: e.target.value}});
  }

  _renderInputs = () =>
    this.inputs.map((input, i) => {
      const {name, label, placeholder, type} = input;
      const {error} = this.props;
      return (
        <FormGroup key={i} controlId={name} validationState={error && error[name] ? 'error' : null}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl
            type={type}
            value={this.state.form[name]}
            placeholder={placeholder}
            onChange={e => this.handleChange(name, e)}
          />
          {error && error[name] && (
            <HelpBlock>
              <span className="error">{error[name]}</span>
            </HelpBlock>
          )}
        </FormGroup>
      );
    });

  render() {
    return (
      <ScreenWrapper title="Register" titleCenter maxWidth={500}>
        <form onSubmit={this.submit} className="clearfix">
          {this._renderInputs()}
          <Button type="submit" bsStyle="primary" className="pull-right">
            {this.props.loading ? <Spinner color="white" /> : 'Submit'}
          </Button>
        </form>
        <span>
          Go to <Link to={ROUTE_LOGIN}>login</Link>
        </span>
      </ScreenWrapper>
    );
  }
}

const mapStateToProps = ({user}) => ({
  error: user.registerError,
  loading: user.registerLoading,
  success: user.registerSuccess,
});

const mapDispatchToProps = dispatch => ({
  register: payload => dispatch(userActions.registerRequest(payload)),
});

const RegisterScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreenComponent);

export {RegisterScreen};
