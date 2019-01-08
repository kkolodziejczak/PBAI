import {RequestHandler} from '../requestHandler';

export async function apiGetShare(id) {
  const data = await RequestHandler.getInstance().request('get', `/shares/${id}`, {});
  return data;
}
