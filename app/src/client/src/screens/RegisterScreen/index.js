import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {compose} from 'redux';
import {Link, withRouter} from 'react-router-dom';
import {userActions} from 'redux/actions/user';
import {connect} from 'react-redux';
import ScreenWrapper from 'components/ScreenWrapper';
import {ROUTE_LOGIN, ROUTE_DASHBOARD} from 'constants/routes';
import SubmitButton from 'components/SubmitButton';

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

  submit = e => {
    e.preventDefault();
    this.props.register(this.state.form);
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
              <span className='error'>{error[name]}</span>
            </HelpBlock>
          )}
        </FormGroup>
      );
    });

  render() {
    return (
      <ScreenWrapper title='Register' titleCenter maxWidth={500}>
        <form onSubmit={this.submit} className='clearfix'>
          {this._renderInputs()}
          <SubmitButton loading={this.props.loading} text='Submit' />
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
  isLoggedIn: user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  register: payload => dispatch(userActions.registerRequest(payload)),
});

const RegisterScreen = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RegisterScreenComponent);

export {RegisterScreen};
