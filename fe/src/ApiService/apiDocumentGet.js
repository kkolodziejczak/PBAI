import {RequestHandler} from './requestHandler';

export async function apiDocumentGet(id) {
  const data = await RequestHandler.getInstance().request('get', `/documents/${id}`, {});
  return data;
}
