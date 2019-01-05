import {put, call, take} from 'redux-saga/effects';
import {documentActions} from '../actions/document';
import {prefix, GET_SHARES} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {apiDocumentShare} from 'ApiService/document/apiDocumentShare';
import {apiDocumentSend} from 'ApiService/document/apiDocumentSend';
import {apiGetShares} from 'ApiService/document/apiGetShares';
import {apiGetShare} from 'ApiService/document/apiGetShare';
import {apiSetOwnerPublicKey} from 'ApiService/document/apiSetOwnerPublicKey';
import {mapError, statusIsValid, parseArray, encode, diffieHellman} from 'helpers/index';

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
    const call1 = yield call(apiDocumentShare, payload);
    const {response, status} = call1;
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

    //TODO: change _id
    const shareId = response.id;
    const call2 = yield call(apiGetShares);
    const shares = parseArray(call2.response);
    const myShareId = shares.filter(share => share === shareId)[0];
    const call3 = yield call(apiGetShare, myShareId);
    const {prime, generator} = call3.response;

    const ownerPrivateKey = encode('ownerPrivateKey', 'ownerPrivateKey');
    const {publicKey} = diffieHellman(prime, generator, ownerPrivateKey);
    const call4Params = {payload: {publicKey}, shareId: myShareId};
    yield call(apiSetOwnerPublicKey, call4Params);
  }
}

export function* getShares() {
  while (true) {
    yield take(GET_SHARES);
    const call1 = yield call(apiGetShares);
    const sharesArr = parseArray(call1.response);
    const shares = yield sharesArr.map(async shareId => {
      const {response} = await apiGetShare(shareId);
      return response;
    });
    yield put(documentActions.setShares(shares));
    console.log('shares', shares);
    // yield put(documentActions.setShares(call1.response));
  }
}
