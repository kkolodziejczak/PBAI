import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.DOCUMENT_SEND),
};

const document = handleActions(
  {
    ...createReducers(prefix.DOCUMENT_SEND),
  },
  initialState,
);

export default document;
