import { expect } from '@playwright/test';
import { test } from '../fixtures/api';
import { Coordinates, findCoordinates } from '../utils/find-coordinates';
import { currentWeatherPath, getCurrentWeather } from '../utils/get-current-weather';

test.describe('Current weather', () => {
  let utrechtCoordinates: Coordinates;

  test.beforeEach(async ({ apiClient }) => {
    utrechtCoordinates = await findCoordinates(apiClient, 'Utrecht,NL');
  });

  test('returns 401 without APPID', async ({ apiClient }) => {
    const result = await apiClient.get(`${currentWeatherPath}?lat=${utrechtCoordinates.lat}&lon=${utrechtCoordinates.lon}`);

    expect(result.status).toBe(401);
    expect(result.body).toEqual({
      cod: 401,
      message: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.',
    });
  });

  test('returns the weather for Utrecht with a valid APPID', async ({ apiClient }) => {
    const weather = await getCurrentWeather(apiClient, utrechtCoordinates);

    expect(weather.name).toBe('Utrecht');
  });

  test('returns the temperature in Celsius or Kelvin when requested', async ({ apiClient }) => {
    const kelvinWeather = await getCurrentWeather(apiClient, utrechtCoordinates);
    const celsiusWeather = await getCurrentWeather(apiClient, { ...utrechtCoordinates, units: 'metric' });

    // Expected range for Utrecht: -20 °C to +45 °C, which is 253.15 K to 318.15 K
    const kelvin = kelvinWeather.main.temp;
    expect(kelvin).toBeGreaterThanOrEqual(253.15);
    expect(kelvin).toBeLessThanOrEqual(318.15);

    const celsius = celsiusWeather.main.temp;
    expect(celsius).toBeGreaterThanOrEqual(-20);
    expect(celsius).toBeLessThanOrEqual(45);
  });
});
