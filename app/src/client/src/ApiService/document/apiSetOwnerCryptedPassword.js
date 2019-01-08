import {RequestHandler} from '../requestHandler';

export async function apiSetOwnerCryptedPassword(params) {
  const {payload, shareId} = params;
  const data = await RequestHandler.getInstance().request('post', `/shares/${shareId}/2`, {
    payload,
  });
  return data;
}
