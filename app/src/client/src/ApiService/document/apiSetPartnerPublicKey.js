import {RequestHandler} from '../requestHandler';

export async function apiSetPartnerPublicKey(params) {
  const {payload, shareId} = params;
  const data = await RequestHandler.getInstance().request('post', `/shares/${shareId}/1`, {
    payload,
  });
  return data;
}
