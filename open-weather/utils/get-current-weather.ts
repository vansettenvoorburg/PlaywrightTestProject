import { ApiClient } from '../../api-helper/api-client';
import { CurrentWeather } from '../types/current-weather';

export const currentWeatherPath = '/data/2.5/weather';

export interface CurrentWeatherOptions {
  lat?: number;
  lon?: number;
  id?: number;
  units?: 'standard' | 'metric' | 'imperial';
}

export async function getCurrentWeather(apiClient: ApiClient, options: CurrentWeatherOptions): Promise<CurrentWeather> {
  const query = new URLSearchParams({ appid: process.env.APPID! });
  for (const [name, value] of Object.entries(options)) {
    query.set(name, String(value));
  }

  const result = await apiClient.get(`${currentWeatherPath}?${query}`, { expectedStatus: 200 });
  return result.body as CurrentWeather;
}
