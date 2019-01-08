import {createAction} from 'redux-actions';
import {GET_PERMISSIONS, SET_PERMISSIONS} from 'constants/actionTypes';

export const permissionsActions = {
  getPermissions: createAction(GET_PERMISSIONS),
  setPermissions: createAction(SET_PERMISSIONS, payload => payload),
};
