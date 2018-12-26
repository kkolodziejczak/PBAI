import {USER_SET_TOKEN} from 'constants/actionTypes';

export function actionSetUserToken(payload) {
  return {
    type: USER_SET_TOKEN,
    payload,
  };
}
