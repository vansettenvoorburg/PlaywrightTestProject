import { test } from '../fixtures/pages';
import { fullName } from '../test-data/user';
import { registrationUserCustomAddress } from '../test-data/users/registration-user-custom-address';
import { registrationUserLookedUpAddress } from '../test-data/users/registration-user-looked-up-address';

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
    const user = registrationUserCustomAddress;
    await registerPage.registerWithAllFields(user);

    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(fullName(user));
    await profilePage.expectLoaded();
    await profilePage.expectDetails(user);
  });

  test('user can register with required fields and a looked-up address', async ({ registerPage, loginPage, profilePage }) => {
    const user = registrationUserLookedUpAddress;
    await registerPage.fillRequiredFields(user);
    await registerPage.expectAutoFilledAddress(user);
    await registerPage.submit();

    await loginPage.expectLoaded();
    await loginPage.login(user.email, user.password);
    await loginPage.menu.goToMyProfile(fullName(user));
    await profilePage.expectLoaded();
    await profilePage.expectDetails(user);
  });
});
