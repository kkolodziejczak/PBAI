import {handleActions} from 'redux-actions';
import {createReducers, createInitialState} from 'helpers/redux';
import {prefix, USER_LOGOUT} from 'constants/actionTypes';
import {apiUserLogout} from 'ApiService/apiUserLogout';

const initialState = {
  ...createInitialState(prefix.REGISTER, 'isLoggedIn'),
  ...createInitialState(prefix.LOGIN, 'isLoggedIn'),
};

const user = handleActions(
  {
    ...createReducers(prefix.REGISTER, 'isLoggedIn'),
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
