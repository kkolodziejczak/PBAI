import {RequestHandler} from '../requestHandler';

export async function apiAdminGetLogs(payload) {
  const data = await RequestHandler.getInstance().request('get', '/logs', {
    payload,
  });
  return data;
}
