import {put, call, take} from 'redux-saga/effects';
// import {call, take} from 'redux-saga/effects';
import {documentActions} from '../actions/document';
import {prefix} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {mapError, statusIsValid} from 'helpers/index';
import {apiDocumentSend} from 'ApiService/apiDocumentSend';
import {apiDocumentShare} from '../../ApiService/apiDocumentShare';

export function* send() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.DOCUMENT_SEND, suffix.REQUEST));
    const {response, status} = yield call(apiDocumentSend, payload);
    if (statusIsValid(status)) {
      yield put(documentActions.documentSendSuccess(response.id));
    } else {
      let error;
      if (status === 401) {
        error = 'you are not authorized to send the document';
      } else {
        error = mapError(response);
      }
      yield put(documentActions.documentSendError(error));
    }
  }
}

export function* share() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.DOCUMENT_SHARE, suffix.REQUEST));
    const {response, status} = yield call(apiDocumentShare, payload);
    if (statusIsValid(status)) {
      yield put(documentActions.documentShareSuccess(response));
    } else {
      let error;
      if (status === 401) {
        error = {login: 'you are not authorized to send the document'};
      } else if (status === 400) {
        if (response !== 'Bad Request' && response !== '400') {
          error = mapError(response);
        } else {
          error = {login: 'given login is not valid'};
        }
      }
      yield put(documentActions.documentShareError(error));
    }
  }
}
