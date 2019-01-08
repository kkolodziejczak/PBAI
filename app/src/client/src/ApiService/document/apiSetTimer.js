import {RequestHandler} from '../requestHandler';

export async function apiSetTimer(payload) {
  const data = await RequestHandler.getInstance().request('put', '/timer/permissions', {
    payload,
  });
  return data;
}
