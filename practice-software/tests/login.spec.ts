import { mergeTests } from '@playwright/test';
import { test as apiTest } from '../fixtures/api';
import { test as pagesTest } from '../fixtures/pages';
import { fullName } from '../test-data/user';
import { adminUser } from '../test-data/users/admin-user';
import { customerUser } from '../test-data/users/customer-user';
import { totpUser } from '../test-data/users/totp-user';
import { registerUser } from '../utils/api/register-user';
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
    await loginPage.login(adminUser.email, adminUser.password);
    await loginPage.menu.expectLoggedInAsAdmin(fullName(adminUser));
  });

  test('user can log in and has user rights', async ({ loginPage }) => {
    await loginPage.login(customerUser.email, customerUser.password);
    await loginPage.menu.expectLoggedInAsUser(fullName(customerUser));
  });

  test('user can enable TOTP and log in with it', async ({ api, loginPage, profilePage }) => {
    const user = totpUser;
    await registerUser(api, user);
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(fullName(user));
    await profilePage.expectLoaded();

    const totpSecret = await profilePage.readTotpSecret();
    await profilePage.activateTotp(generateTotp(totpSecret, await fetchServerTimeMs(api)));
    await profilePage.expectTotpEnabled();

    await profilePage.menu.signOut(fullName(user));
    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.verifyTotp(generateTotp(totpSecret, await fetchServerTimeMs(api)));
    await loginPage.menu.expectLoggedInAsUser(fullName(user));
  });
});
