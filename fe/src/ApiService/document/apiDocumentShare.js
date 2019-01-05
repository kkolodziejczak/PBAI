import {RequestHandler} from '../requestHandler';

export async function apiDocumentShare(payload) {
  const data = await RequestHandler.getInstance().request('put', '/shares', {
    payload,
  });
  return data;
}
