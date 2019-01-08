import {handleActions} from 'redux-actions';
import {GET_PERMISSIONS, SET_PERMISSIONS} from 'constants/actionTypes';

const initialState = {};

const permissions = handleActions(
  {
    [GET_PERMISSIONS]: permissions => permissions,
    [SET_PERMISSIONS]: (_, action) => action.payload,
  },
  initialState,
);

export default permissions;
