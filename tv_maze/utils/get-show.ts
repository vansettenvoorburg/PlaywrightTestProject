import { ApiClient } from '../../api-helper/api-client';
import { Show } from '../types/show';

export async function getShow(apiClient: ApiClient, id: number): Promise<Show> {
  const result = await apiClient.get(`/shows/${id}`, { expectedStatus: 200 });
  return result.body as Show;
}
