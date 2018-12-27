import {combineReducers} from 'redux';
import user from './user';
import document from './document';

export default combineReducers({
  user,
  document,
});
