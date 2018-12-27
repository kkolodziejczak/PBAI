import {createActions} from 'helpers/redux';
import {prefix} from 'constants/actionTypes';

export const documentActions = {
  ...createActions(prefix.DOCUMENT_SEND),
};
