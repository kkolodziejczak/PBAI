import {createActions} from 'helpers/redux';
import {createAction} from 'redux-actions';
import {prefix, USER_LOGOUT} from 'constants/actionTypes';

export const userActions = {
  ...createActions(prefix.REGISTER),
  ...createActions(prefix.LOGIN),
  logout: createAction(USER_LOGOUT),
};
