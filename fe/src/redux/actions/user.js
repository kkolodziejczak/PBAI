import {createActions} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

export const userActions = {
  ...createActions(prefix.REGISTER),
  ...createActions(prefix.LOGIN),
};
