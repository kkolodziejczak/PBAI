import {RequestHandler} from '../requestHandler';

export async function apiGetShares() {
  const data = await RequestHandler.getInstance().request('get', `/shares`, {});
  return data;
}
