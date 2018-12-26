import {RequestHandler} from './requestHandler';

export async function apiUserLogin(payload) {
  const data = await RequestHandler.getInstance().request('post', '/login', {
    payload,
  });
  return data;
}
