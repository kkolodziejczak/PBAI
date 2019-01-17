import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
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

const initialState = {
  ...createInitialState(prefix.DOCUMENT_SEND),
  ...createInitialState(prefix.DOCUMENT_SHARE),
  myDocuments: null,
  shares: null,
  timers: [],
};

const document = handleActions(
  {
    ...createReducers(prefix.DOCUMENT_SEND),
    ...createReducers(prefix.DOCUMENT_SHARE),
    [SET_MY_DOCUMENTS]: (document, action) => ({...document, myDocuments: action.payload}),
    [GET_SHARES]: document => document,
    [SET_SHARES]: (document, action) => ({...document, shares: action.payload}),
    [SET_CRYPTED_PASSWORD]: document => document,
    [GET_TIMER]: document => document,
    [SET_TIMER]: (document, action) => ({...document, timers: [...document.timers, action.payload]}),
    [UPDATE_SHARES]: document => document,
  },
  initialState,
);

export default document;
