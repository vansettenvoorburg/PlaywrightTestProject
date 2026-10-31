import { ApiClient } from '../../api-helper/api-client';

/** The local clock can differ from the server; a TOTP code must match the server's clock. */
export async function fetchServerTimeMs(apiClient: ApiClient) {
  const result = await apiClient.get('/status', { expectedStatus: 200 });
  return Date.parse(result.headers.date);
}
