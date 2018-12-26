import {USER_SET_TOKEN} from 'constants/actionTypes';

const initialState = {
  token: null,
};

function user(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case USER_SET_TOKEN:
      return {...state, token: payload};
    default:
      return state;
  }
}

export default user;
