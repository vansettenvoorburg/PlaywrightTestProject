import { expect } from '@playwright/test';
import { test } from '../fixtures/api';
import { getShow } from '../utils/api/get-show';
import { searchShows } from '../utils/api/search-shows';

test.describe('Show information', () => {
  test('returns a URL that contains the show ID', async ({ apiClient }) => {
    const results = await searchShows(apiClient, 'breaking bad');
    expect(results.length).toBeGreaterThan(0);
    const showId = results[0].show.id;

    const show = await getShow(apiClient, showId);

    expect(show.url).toContain(`/shows/${showId}/`);
  });
});
