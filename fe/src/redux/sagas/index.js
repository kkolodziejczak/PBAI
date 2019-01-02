import {fork} from 'redux-saga/effects';
import * as user from './user';
import * as document from './document';

export default function* root() {
  yield fork(user.login);
  yield fork(user.register);
  yield fork(user.logout);
  yield fork(user.getProfile);
  yield fork(document.send);
  yield fork(document.share);
}
