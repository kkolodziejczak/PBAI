import {put, call, take} from 'redux-saga/effects';
import {permissionsActions} from '../actions/permissions';
import {documentActions} from '../actions/document';
import {apiGetPermissions} from 'ApiService/permissions/apiGetPermissions';
import {apiGetPermission} from 'ApiService/permissions/apiGetPermission';
import {apiGetDocument} from 'ApiService/document/apiGetDocument';
import {GET_PERMISSIONS} from 'constants/actionTypes';
import {parseArray} from 'helpers/index';

function handlePermissionsResponse(response) {
  if (response === '[]') {
    return [];
  }
  if (typeof response === 'string' && response !== '[]') {
    return parseArray(response);
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
        return {...response, permissionType: permission.type};
      });
      yield put(documentActions.setMyDocuments(documents));
    } else {
      yield put(documentActions.setMyDocuments([]));
    }
  }
}
