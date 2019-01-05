import {put, call, take} from 'redux-saga/effects';
import {permissionsActions} from '../actions/permissions';
import {documentActions} from '../actions/document';
import {apiGetPermissions} from 'ApiService/apiGetPermissions';
import {apiGetPermission} from 'ApiService/apiGetPermission';
import {GET_PERMISSIONS} from 'constants/actionTypes';
import {apiGetDocument} from 'ApiService/apiGetDocument';

function handlePermissionsResponse(response) {
  if (response === '[]') {
    return [];
  }
  if (typeof response === 'string' && response !== '[]') {
    const permissions = response.substring(1, response.length - 1).split(',');
    return permissions.map(permission => permission.substring(1, permission.length - 1));
  }
  return response;
}

export function* getPermissionsAndDocuments() {
  while (true) {
    yield take(GET_PERMISSIONS);
    const {response} = yield call(apiGetPermissions);
    const permissions = handlePermissionsResponse(response);

    let fullPermissions;

    if (typeof response === 'string') {
      fullPermissions = yield permissions.map(async permissionId => {
        const {response} = await apiGetPermission(permissionId);
        return response;
      });
    } else {
      fullPermissions = permissions;
    }

    yield put(permissionsActions.setPermissions(fullPermissions));

    if (fullPermissions) {
      const documents = yield fullPermissions.map(async permission => {
        const {response} = await apiGetDocument(permission.documentId);
        return response;
      });
      yield put(documentActions.setMyDocuments(documents));
    } else {
      yield put(documentActions.setMyDocuments([]));
    }
  }
}
