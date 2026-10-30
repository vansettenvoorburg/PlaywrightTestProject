import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductPage } from '../pages/product-page';
import { ProfilePage } from '../pages/profile-page';

type Pages = {
  productPage: ProductPage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
};

export const test = base.extend<Pages>({
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});
