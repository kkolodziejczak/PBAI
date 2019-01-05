import {RequestHandler} from '../requestHandler';

export async function apiGetUsers() {
  const data = await RequestHandler.getInstance().request('get', '/users', {});
  return data;
}
