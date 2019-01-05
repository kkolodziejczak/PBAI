import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix, SET_MY_DOCUMENTS} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.DOCUMENT_SEND),
  ...createInitialState(prefix.DOCUMENT_SHARE),
  myDocuments: null,
};

const document = handleActions(
  {
    ...createReducers(prefix.DOCUMENT_SEND),
    ...createReducers(prefix.DOCUMENT_SHARE),
    [SET_MY_DOCUMENTS]: (document, action) => ({...document, myDocuments: action.payload}),
  },
  initialState,
);

export default document;
