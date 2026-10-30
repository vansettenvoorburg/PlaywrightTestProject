import { ApiClient } from '../../api-helper/api-client';

/** The local clock can differ from the server; a TOTP code must match the server's clock. */
export async function fetchServerTimeMs(api: ApiClient) {
  const result = await api.get('/status');
  return Date.parse(result.headers.date);
}
