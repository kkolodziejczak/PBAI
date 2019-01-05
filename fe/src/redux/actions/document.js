import {createActions} from 'helpers/redux';
import {createAction} from 'redux-actions';
import {prefix, SET_MY_DOCUMENTS, GET_SHARES, SET_SHARES} from 'constants/actionTypes';

export const documentActions = {
  ...createActions(prefix.DOCUMENT_SEND),
  ...createActions(prefix.DOCUMENT_SHARE),
  setMyDocuments: createAction(SET_MY_DOCUMENTS, payload => payload),
  getShares: createAction(GET_SHARES),
  setShares: createAction(SET_SHARES),
};
