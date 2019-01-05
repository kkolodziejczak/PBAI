import {RequestHandler} from '../requestHandler';

export async function apiGetDocument(id) {
  const data = await RequestHandler.getInstance().request('get', `/documents/${id}`, {});
  return data;
}
