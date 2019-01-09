import {RequestHandler} from '../requestHandler';

export async function apiGetPermissions() {
  const data = await RequestHandler.getInstance().request('get', '/permissions', {});
  return data;
}
