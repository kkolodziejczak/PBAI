import {RequestHandler} from '../requestHandler';

export async function apiSetOwnerPublicKey(params) {
  const {payload, shareId} = params;
  const data = await RequestHandler.getInstance().request('post', `/shares/${shareId}/0`, {
    payload,
  });
  return data;
}
