import {createActions} from 'helpers/redux';
import {createAction} from 'redux-actions';
import {
  prefix,
  SET_MY_DOCUMENTS,
  GET_SHARES,
  SET_SHARES,
  SET_CRYPTED_PASSWORD,
  SET_TIMER,
  GET_TIMER,
  UPDATE_SHARES,
} from 'constants/actionTypes';

export const documentActions = {
  ...createActions(prefix.DOCUMENT_SEND),
  ...createActions(prefix.DOCUMENT_SHARE),
  setMyDocuments: createAction(SET_MY_DOCUMENTS, payload => payload),
  getShares: createAction(GET_SHARES),
  setShares: createAction(SET_SHARES),
  setCryptedPassword: createAction(SET_CRYPTED_PASSWORD),
  getTimer: createAction(GET_TIMER),
  setTimer: createAction(SET_TIMER),
  updateShares: createAction(UPDATE_SHARES),
};
