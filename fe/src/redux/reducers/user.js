import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.REGISTER),
  ...createInitialState(prefix.LOGIN),
};

const user = handleActions(
  {
    ...createReducers(prefix.REGISTER),
    ...createReducers(prefix.LOGIN),
  },
  initialState,
);

export default user;
