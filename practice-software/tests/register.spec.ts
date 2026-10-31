import { test } from '../fixtures/pages';
import { customAddress, lookedUpAddress, registrationUser } from '../test-data/users';
import { uniqueEmail, uniquePassword } from '../utils/unique-credentials';

test.describe('Register', {
  annotation: {
    type: 'issue',
    description: 'Workaround: the site sends the postcode lookup twice. Remove once it is confirmed as intended or fixed.',
  },
}, () => {
  test.beforeEach(async ({ productPage, loginPage, registerPage }) => {
    await productPage.goto();
    await productPage.menu.goToSignIn();
    await loginPage.goToRegister();
    await registerPage.expectLoaded();
  });

  test('user can register with every field filled in', async ({ registerPage, loginPage, profilePage }) => {
    const user = { ...registrationUser, ...customAddress, email: uniqueEmail(), password: uniquePassword() };
    await registerPage.registerWithAllFields(user);

    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(user.name);
    await profilePage.expectLoaded();
    await profilePage.expectDetails(user);
  });

  test('user can register with required fields and a looked-up address', async ({ registerPage, loginPage, profilePage }) => {
    const user = { ...registrationUser, ...lookedUpAddress, email: uniqueEmail(), password: uniquePassword() };
    await registerPage.registerWithRequiredFields(user);

    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(user.name);
    await profilePage.expectLoaded();
    await profilePage.expectDetails(user);
  });
});
