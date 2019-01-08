import {createAction} from 'redux-actions';

export const toCamelCase = str => {
  return str
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/ (.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/ /g, '');
};

//Redux helpers
export const createReducers = (PREFIX, successResultVariable) => {
  const core = toCamelCase(PREFIX);
  const successVar = successResultVariable ? successResultVariable : `${core}Message`;
  return {
    [getActionName(PREFIX, suffix.REQUEST)]: (state, action) => ({
      ...state,
      [`${core}Loading`]: true,
      [`${core}Success`]: false,
    }),
    [getActionName(PREFIX, suffix.SUCCESS)]: (state, action) => ({
      ...state,
      [successVar]: action.payload,
      [`${core}Loading`]: false,
      [`${core}Success`]: true,
      [`${core}Error`]: null,
    }),
    [getActionName(PREFIX, suffix.ERROR)]: (state, action) => ({
      ...state,
      [`${core}Error`]: action.payload,
      [`${core}Loading`]: false,
    }),
    [getActionName(PREFIX, suffix.CLEAR)]: (state, action) => ({
      ...state,
      [`${core}Error`]: null,
      [`${core}Success`]: false,
    }),
  };
};

export const suffix = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CLEAR: 'CLEAR',
};

export const getActionName = (prefix, suffix) => `${prefix}_${suffix}`;

export const createInitialState = (PREFIX, successResultVariable) => {
  const core = toCamelCase(PREFIX);
  const successVar = successResultVariable ? successResultVariable : `${core}Message`;
  return {
    [`${core}Loading`]: false,
    [`${core}Error`]: null,
    [`${core}Success`]: false,
    [successVar]: null,
  };
};

export const createActions = PREFIX => {
  const core = toCamelCase(PREFIX);
  return {
    [`${core}Request`]: createAction(getActionName(PREFIX, suffix.REQUEST), payload => payload),
    [`${core}Success`]: createAction(getActionName(PREFIX, suffix.SUCCESS), payload => payload),
    [`${core}Error`]: createAction(getActionName(PREFIX, suffix.ERROR), payload => payload),
    [`${core}Clear`]: createAction(getActionName(PREFIX, suffix.CLEAR)),
  };
};
