import { expect } from '@playwright/test';
import { test } from '../fixtures/api';
import { findCoordinates } from '../utils/api/find-coordinates';
import { getCurrentWeather } from '../utils/api/get-current-weather';

const cities = [
  { location: 'Amsterdam,NL', id: 2759794 },
  { location: 'Rotterdam,NL', id: 2747891 },
  { location: 'Den Haag,NL', id: 2747373 },
  { location: 'Groningen,NL', id: 2755251 },
];

test.describe('Current weather by city name', () => {
  for (const city of cities) {
    test(`returns ID ${city.id} for ${city.location}`, async ({ apiClient }) => {
      const coordinates = await findCoordinates(apiClient, city.location);
      const weather = await getCurrentWeather(apiClient, coordinates);

      expect(weather.id).toBe(city.id);
    });
  }
});
