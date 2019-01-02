import {createActions} from 'helpers/redux';
import {createAction} from 'redux-actions';
import {prefix, USER_LOGOUT, GET_USER_DATA, SET_USER_DATA} from 'constants/actionTypes';

export const userActions = {
  ...createActions(prefix.REGISTER),
  ...createActions(prefix.LOGIN),
  logout: createAction(USER_LOGOUT),
  getUserData: createAction(GET_USER_DATA),
  setUserData: createAction(SET_USER_DATA, payload => payload),
};
