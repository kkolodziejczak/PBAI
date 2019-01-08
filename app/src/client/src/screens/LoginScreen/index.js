import React from 'react';
import {compose} from 'redux';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {userActions} from 'redux/actions/user';
import {Link} from 'react-router-dom';
import SubmitButton from 'components/SubmitButton';
import ScreenWrapper from 'components/ScreenWrapper';
import {ROUTE_REGISTER, ROUTE_DASHBOARD} from 'constants/routes';

class LoginScreenComponent extends React.Component {
  state = {
    form: {
      login: '',
      password: '',
    },
  };

  componentDidMount() {
    const {isLoggedIn, history} = this.props;
    if (isLoggedIn) {
      history.push(ROUTE_DASHBOARD);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.props.history.push(ROUTE_DASHBOARD);
    }
  }

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
    ];
  }

  submit = e => {
    e.preventDefault();
    this.props.login(this.state.form);
  };

  handleChange(key, e) {
    this.setState({form: {...this.state.form, [key]: e.target.value}});
  }

  _renderFooter = () => (
    <span>
      Don't have account yet? <Link to={ROUTE_REGISTER}>Register</Link>
    </span>
  );

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
              <span className='error'>{error[name]}</span>
            </HelpBlock>
          )}
        </FormGroup>
      );
    });
  render() {
    return (
      <ScreenWrapper title='Login' titleCenter maxWidth={500}>
        <form onSubmit={this.submit} className='clearfix'>
          {this._renderInputs()}
          <SubmitButton loading={this.props.loading} text='Submit' />
        </form>
        {this._renderFooter()}
      </ScreenWrapper>
    );
  }
}
const mapStateToProps = ({user}) => ({
  error: user.loginError,
  loading: user.loginLoading,
  success: user.loginSuccess,
  isLoggedIn: user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(userActions.loginRequest(payload)),
});

const LoginScreen = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(LoginScreenComponent);

export {LoginScreen};
