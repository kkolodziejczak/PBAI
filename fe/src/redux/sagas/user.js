import {put, call, take} from 'redux-saga/effects';
import {userActions} from '../actions/user';
import {prefix} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {mapError, statusIsValid} from 'helpers/index';
import {apiUserRegister} from 'ApiService/apiUserRegister';
import {apiUserLogin} from 'ApiService/apiUserLogin';

export function* login() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.LOGIN, suffix.REQUEST));
    const {response, status} = yield call(apiUserLogin, payload);
    if (statusIsValid(status)) {
      yield put(userActions.loginSuccess());
    } else {
      let error;
      if (status === 401) {
        error = {login: ' ', password: 'Incorrect login or password'};
      } else {
        error = mapError(response);
      }
      yield put(userActions.loginError(error));
    }
  }
}

export function* register() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.REGISTER, suffix.REQUEST));
    const {response, status} = yield call(apiUserRegister, payload);

    if (statusIsValid(status)) {
      //TODO: handle success
      yield put(userActions.registerSuccess());
    } else {
      let error;
      if (status === 409) {
        error = {login: 'User with this login already exists.'};
      } else {
        error = mapError(response);
      }
      yield put(userActions.registerError(error));
    }
  }
}
