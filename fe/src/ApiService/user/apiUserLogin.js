import {RequestHandler} from '../requestHandler';

export async function apiUserLogin(payload) {
  const data = await RequestHandler.getInstance().request('post', '/auth', {
    payload,
  });
  return data;
}
