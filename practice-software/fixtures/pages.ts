import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductPage } from '../pages/product-page';

type Pages = {
  productPage: ProductPage;
  loginPage: LoginPage;
};

export const test = base.extend<Pages>({
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
