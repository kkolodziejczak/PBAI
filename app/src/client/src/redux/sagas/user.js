import {put, call, take} from 'redux-saga/effects';
import {userActions} from '../actions/user';
import {prefix, USER_LOGOUT, GET_USER_DATA} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {apiUserRegister} from 'ApiService/user/apiUserRegister';
import {apiUserLogin} from 'ApiService/user/apiUserLogin';
import {apiUserLogout} from 'ApiService/user/apiUserLogout';
import {apiGetUsers} from 'ApiService/user/apiGetUsers';
import {mapError, statusIsValid} from 'helpers/index';

export function* login() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.LOGIN, suffix.REQUEST));
    const {response, status} = yield call(apiUserLogin, payload);
    if (statusIsValid(status)) {
      yield put(userActions.loginSuccess(true));
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
      yield put(userActions.registerSuccess(true));
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

export function* logout() {
  while (true) {
    yield take(USER_LOGOUT);
    yield call(apiUserLogout);
  }
}

export function* getProfile() {
  while (true) {
    yield take(GET_USER_DATA);
    const {response} = yield call(apiGetUsers);
    yield put(userActions.setUserData(response));
  }
}
