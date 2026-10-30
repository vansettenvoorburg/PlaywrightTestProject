import { test } from '../fixtures/pages';

test.describe('Login', () => {
  test.beforeEach(async ({ productPage, loginPage }) => {
    await productPage.goto();
    await productPage.menu.goToSignIn();
    await loginPage.expectLoaded();
  });

  test('admin can log in and has admin rights', async ({ loginPage }) => {
    await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await loginPage.menu.expectLoggedInAsAdmin(process.env.ADMIN_NAME!);
  });

  test('user can log in and has user rights', async ({ loginPage }) => {
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await loginPage.menu.expectLoggedInAsUser(process.env.USER_NAME!);
  });
});
