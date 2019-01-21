import {fork} from 'redux-saga/effects';
import * as user from './user';
import * as document from './document';
import * as permissions from './permissions';

export default function* root() {
  yield fork(user.login);
  yield fork(user.register);
  yield fork(user.logout);
  yield fork(user.getProfile);

  yield fork(document.send);
  yield fork(document.share);
  yield fork(document.getShares);
  yield fork(document.setCryptedPassword);
  yield fork(document.setTimer);
  yield fork(document.updateShares);

  yield fork(permissions.getPermissionsAndDocuments);
}
