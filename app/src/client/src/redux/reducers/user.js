import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix, USER_LOGOUT, GET_USER_DATA, SET_USER_DATA} from 'constants/actionTypes';

const initialState = {
  ...createInitialState(prefix.REGISTER, 'isLoggedIn'),
  ...createInitialState(prefix.LOGIN, 'isLoggedIn'),
  me: {},
};

const user = handleActions(
  {
    ...createReducers(prefix.REGISTER, 'isLoggedIn'),
    ...createReducers(prefix.LOGIN, 'isLoggedIn'),
    [USER_LOGOUT]: user => ({...user, isLoggedIn: false}),
    [GET_USER_DATA]: user => user,
    [SET_USER_DATA]: (user, action) => ({...user, me: action.payload}),
  },
  initialState,
);

export default user;
