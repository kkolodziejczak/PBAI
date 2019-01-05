import {RequestHandler} from '../requestHandler';

export async function apiDocumentSend(payload) {
  const data = await RequestHandler.getInstance().request('put', '/documents', {
    payload,
  });
  return data;
}
