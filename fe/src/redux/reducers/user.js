import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.REGISTER),
};

const user = handleActions(
  {
    ...createReducers(prefix.REGISTER),
  },
  initialState,
);

export default user;
