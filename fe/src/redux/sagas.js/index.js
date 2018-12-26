import {fork} from 'redux-saga/effects';
import * as user from './user';

export default function* root() {
  yield fork(user.login);
}
