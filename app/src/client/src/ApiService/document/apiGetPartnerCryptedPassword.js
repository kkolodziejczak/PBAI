import {RequestHandler} from '../requestHandler';

export async function apiGetPartnerCryptedPassword(params) {
  const {payload, shareId} = params;
  const data = await RequestHandler.getInstance().request('post', `/shares/${shareId}/3`, {
    payload,
  });
  return data;
}
