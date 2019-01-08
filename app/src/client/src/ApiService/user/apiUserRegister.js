import {RequestHandler} from '../requestHandler';

export async function apiUserRegister(payload) {
  const data = await RequestHandler.getInstance().request('put', '/auth', {
    payload,
  });
  return data;
}
