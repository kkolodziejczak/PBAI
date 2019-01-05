import {RequestHandler} from '../requestHandler';

export async function apiSetPublicKey(params) {
  const {payload, shareId, type} = params;
  const data = await RequestHandler.getInstance().request('post', `/shares/${shareId}/${type}`, {
    payload,
  });
  return data;
}
