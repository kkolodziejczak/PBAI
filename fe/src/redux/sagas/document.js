import {put, call, take} from 'redux-saga/effects';
import {documentActions} from '../actions/document';
import {prefix, GET_SHARES, SET_CRYPTED_PASSWORD} from 'constants/actionTypes';
import {suffix, getActionName} from 'helpers/redux';
import {apiDocumentShare} from 'ApiService/document/apiDocumentShare';
import {apiDocumentSend} from 'ApiService/document/apiDocumentSend';
import {apiGetShares} from 'ApiService/document/apiGetShares';
import {apiGetShare} from 'ApiService/document/apiGetShare';
import {apiGetDocument} from 'ApiService/document/apiGetDocument';
import {apiSetOwnerPublicKey} from 'ApiService/document/apiSetOwnerPublicKey';
import {apiSetPartnerPublicKey} from 'ApiService/document/apiSetPartnerPublicKey';
import {apiSetOwnerCryptedPassword} from 'ApiService/document/apiSetOwnerCryptedPassword';
import {apiGetPartnerCryptedPassword} from 'ApiService/document/apiGetPartnerCryptedPassword';
import {mapError, statusIsValid, parseArray, diffieHellman, decodeDH} from 'helpers/index';
import {OWNER_PRIVATE_KEY, PARTNER_PRIVATE_KEY} from 'constants/index';

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

    const shareId = response.id;
    const call2 = yield call(apiGetShares);
    const shares = parseArray(call2.response);
    const myShareId = shares.filter(share => share === shareId)[0];
    const call3 = yield call(apiGetShare, myShareId);
    const {prime, generator} = call3.response;

    const {publicKey} = diffieHellman(prime, generator, OWNER_PRIVATE_KEY);
    const call4Params = {payload: {publicKey}, shareId: myShareId};
    yield call(apiSetOwnerPublicKey, call4Params);
  }
}

export function* getShares() {
  while (true) {
    yield take(GET_SHARES);

    //get and set shares
    const call1 = yield call(apiGetShares);
    const sharesArr = parseArray(call1.response);
    const shares = yield sharesArr.map(async shareId => {
      const {response} = await apiGetShare(shareId);
      return response;
    });
    yield put(documentActions.setShares(shares));

    let stateUpdated = false;
    yield shares.forEach(async share => {
      const {prime, generator, isOwner, state} = share;
      const {publicKey: ownerPublicKey} = diffieHellman(prime, generator, OWNER_PRIVATE_KEY);
      const {publicKey: partnerPublicKey} = diffieHellman(prime, generator, PARTNER_PRIVATE_KEY);

      if (isOwner && state === 0) {
        //sending public keys for documents shared by me
        const params = {payload: {publicKey: ownerPublicKey}, shareId: share.id};
        await apiSetOwnerPublicKey(params);
        stateUpdated = true;
      }
      if (!isOwner && state === 1) {
        //sending public keys for documents shared with me
        const params = {payload: {publicKey: partnerPublicKey}, shareId: share.id};
        await apiSetPartnerPublicKey(params);
        stateUpdated = true;
      }
      if (!isOwner && state === 3) {
        const params = {payload: {publicKey: partnerPublicKey}, shareId: share.id};
        const r = await apiGetPartnerCryptedPassword(params);
        const {documentId} = share;
        const d = await apiGetDocument(documentId);
        const content = d.response.content;
        const name = d.response.name;
        const decodedPassword = decodeDH(prime, generator, PARTNER_PRIVATE_KEY, ownerPublicKey, r.response.crypted);
        console.log('decodedPassword', decodedPassword);
        console.log('D', d);
        console.log('R', r);
      }
    });

    if (stateUpdated) {
      //update shares again with new state
      const callLast = yield call(apiGetShares);
      const newSharesArr = parseArray(callLast.response);
      const newShares = yield newSharesArr.map(async shareId => {
        const {response} = await apiGetShare(shareId);
        return response;
      });
      yield put(documentActions.setShares(newShares));
    }
  }
}

export function* setCryptedPassword() {
  while (true) {
    const {payload} = yield take(SET_CRYPTED_PASSWORD);
    const {shareId, password} = payload;
    const {response} = yield call(apiGetShare, shareId);
    const {prime, generator, destinationUser} = response;
    //apiSetOwnerCryptedPassword
    const {publicKey, encoded} = diffieHellman(
      prime,
      generator,
      OWNER_PRIVATE_KEY,
      destinationUser.publicKey,
      password,
    );
    const params = {payload: {publicKey, crypted: encoded}, shareId};
    yield call(apiSetOwnerCryptedPassword, params);

    //update shares again with new state
    const callLast = yield call(apiGetShares);
    const newSharesArr = parseArray(callLast.response);
    const newShares = yield newSharesArr.map(async shareId => {
      const {response} = await apiGetShare(shareId);
      return response;
    });
    yield put(documentActions.setShares(newShares));
  }
}
