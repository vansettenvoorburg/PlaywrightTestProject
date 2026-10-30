import { test as base } from '@playwright/test';
import { ApiClient } from '../../api-helper/api-client';

type Api = {
  api: ApiClient;
};

export const test = base.extend<Api>({
  api: async ({}, use) => {
    const api = new ApiClient(process.env.API_URL!);
    await use(api);
    await api.close();
  },
});
