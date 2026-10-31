import { ApiClient } from '../../api-helper/api-client';
import { ShowSearchResult } from '../types/show';

export async function searchShows(apiClient: ApiClient, query: string): Promise<ShowSearchResult[]> {
  const result = await apiClient.get(`/search/shows?q=${encodeURIComponent(query)}`, { expectedStatus: 200 });
  return result.body as ShowSearchResult[];
}
