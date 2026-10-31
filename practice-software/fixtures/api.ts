import { test as base } from '@playwright/test';
import { ApiClient } from '../../api-helper/api-client';

type Api = {
  apiClient: ApiClient;
};

export const test = base.extend<Api>({
  apiClient: async ({}, use) => {
    const apiClient = new ApiClient(process.env.API_URL!);
    await use(apiClient);
    await apiClient.close();
  },
});
