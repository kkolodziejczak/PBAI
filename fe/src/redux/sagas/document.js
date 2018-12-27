import {put, call, take} from 'redux-saga/effects';
import {documentActions} from '../actions/document';
import {prefix} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
// import {mapError, statusIsValid} from 'helpers/index';
import {apiDocumentSend} from 'ApiService/apiDocumentSend';

export function* send() {
  while (true) {
    const {payload} = yield take(getActionName(prefix.DOCUMENT_SEND, suffix.REQUEST));
    const {response, status} = yield call(apiDocumentSend, payload);
    console.log('RES', response, 'STATUS', status);
    if (status === 401) {
      yield put(documentActions.documentSendError('You are not authorized to send the document.'));
    }
    //TODO: handle success
  }
}
