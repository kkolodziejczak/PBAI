import {RequestHandler} from '../requestHandler';

export async function apiGetPermission(id) {
  const data = await RequestHandler.getInstance().request('get', `/permissions/${id}`, {});
  return data;
}
