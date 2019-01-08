import {RequestHandler} from '../requestHandler';

export async function apiUserLogout(payload) {
  const data = await RequestHandler.getInstance().request('delete', '/auth', {});
  return data;
}
