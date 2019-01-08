import {combineReducers} from 'redux';
import user from './user';
import document from './document';
import permissions from './permissions';

export default combineReducers({
  user,
  document,
  permissions,
});
