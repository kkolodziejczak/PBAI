import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix, USER_LOGOUT} from 'constants/actionTypes';
import {apiUserLogout} from 'ApiService/apiUserLogout';

const initialState = {
  ...createInitialState(prefix.REGISTER),
  ...createInitialState(prefix.LOGIN, 'isLoggedIn'),
};

const user = handleActions(
  {
    ...createReducers(prefix.REGISTER),
    ...createReducers(prefix.LOGIN, 'isLoggedIn'),
    [USER_LOGOUT]: async state => {
      await apiUserLogout();
      return {
        ...state,
        isLoggedIn: false,
      };
    },
  },
  initialState,
);

export default user;
