import {put, call, take} from 'redux-saga/effects';
import {userActions} from '../actions/user';
import {prefix} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {apiUserRegister} from 'ApiService/apiUserRegister';

export function* login() {}

export function* register() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.REGISTER, suffix.REQUEST));
    const res = yield call(apiUserRegister, payload);
    console.log('res', res);

    if (res) {
      const tmp = res.split('\\');
      tmp.shift();
      const fieldName = tmp[0].substring(1);
      const error = tmp[1].substring(2, tmp[1].length - 2);
      yield put(userActions.registerError({[fieldName]: error}));
    } else {
      yield put(userActions.registerSuccess());
    }
  }
}
