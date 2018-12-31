import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.DOCUMENT_SEND, 'documentId'),
  ...createInitialState(prefix.DOCUMENT_SHARE),
};

const document = handleActions(
  {
    ...createReducers(prefix.DOCUMENT_SEND, 'documentId'),
    ...createReducers(prefix.DOCUMENT_SHARE),
  },
  initialState,
);

export default document;
