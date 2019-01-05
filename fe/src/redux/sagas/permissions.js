import {put, call, take} from 'redux-saga/effects';
import {permissionsActions} from '../actions/permissions';
import {documentActions} from '../actions/document';
import {apiGetPermissions} from 'ApiService/apiGetPermissions';
import {GET_PERMISSIONS} from 'constants/actionTypes';
import {apiGetDocument} from 'ApiService/apiGetDocument';

export function* getPermissionsAndDocuments() {
  while (true) {
    yield take(GET_PERMISSIONS);
    const {response} = yield call(apiGetPermissions);
    yield put(permissionsActions.setPermissions(response));
    const documents = yield response.map(async permission => {
      const {response} = await apiGetDocument(permission.documentId);
      return response;
    });
    yield put(documentActions.setMyDocuments(documents));
  }
}
