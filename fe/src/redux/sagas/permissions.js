import {put, call, take} from 'redux-saga/effects';
import {permissionsActions} from '../actions/permissions';
import {apiGetPermissions} from 'ApiService/apiGetPermissions';
import {GET_PERMISSIONS} from 'constants/actionTypes';

export function* getPermissions() {
  while (true) {
    yield take(GET_PERMISSIONS);
    const {response} = yield call(apiGetPermissions);
    yield put(permissionsActions.setPermissions(response));
  }
}
