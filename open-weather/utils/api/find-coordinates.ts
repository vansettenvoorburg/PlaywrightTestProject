import { ApiClient } from '../../../api-helper/api-client';

export interface Coordinates {
  lat: number;
  lon: number;
}

export async function findCoordinates(apiClient: ApiClient, location: string): Promise<Coordinates> {
  const result = await apiClient.get(`/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.APPID}`, { expectedStatus: 200 });
  const [match] = result.body as Coordinates[];
  if (!match) throw new Error(`No coordinates found for '${location}'`);
  return { lat: match.lat, lon: match.lon };
}
