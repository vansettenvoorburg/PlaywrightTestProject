import { mergeTests } from '@playwright/test';
import { test as apiTest } from '../fixtures/api';
import { test as pagesTest } from '../fixtures/pages';
import { totpUser } from '../test-data/users';
import { registerUser } from '../utils/api/register-user';
import { uniqueEmail, uniquePassword } from '../utils/unique-credentials';
import { fetchServerTimeMs } from '../utils/server-time';
import { generateTotp } from '../utils/totp';

const test = mergeTests(pagesTest, apiTest);

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

  test('user can enable TOTP and log in with it', async ({ api, loginPage, profilePage }) => {
    const user = { ...totpUser, email: uniqueEmail(), password: uniquePassword() };
    await registerUser(api, user);
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(user.name);
    await profilePage.expectLoaded();

    const totpSecret = await profilePage.readTotpSecret();
    await profilePage.activateTotp(generateTotp(totpSecret, await fetchServerTimeMs(api)));
    await profilePage.expectTotpEnabled();

    await profilePage.menu.signOut(user.name);
    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.verifyTotp(generateTotp(totpSecret, await fetchServerTimeMs(api)));
    await loginPage.menu.expectLoggedInAsUser(user.name);
  });
});
