# Practice Software Testing

## Design decisions

### Shared components through composition

The navigation menu is a separate class, `NavMenu`, that each page object holds as a `menu` property. Pages do not inherit from a base page.

- **Single responsibility**: a page object only describes its own page; the menu is described once.
- **No inheritance**: a page without the menu simply has no `menu`, instead of inheriting methods that do not work on that page.
- **No interface for the menu**: there is only one menu implementation, so an abstraction would add a layer without benefit.
- **The menu only navigates**: it does not return the next page object. Otherwise the menu would have to know every page, and every page would know the menu.

### Page object format

- `page` is passed to the constructor.
- Each element is a private getter that returns a locator, so every locator is defined in one place.
- Actions and checks are public methods that use those getters, for example `login()` and `expectLoaded()`. Tests only talk to a page through these methods, never through a locator.
- Steps that only exist to build a public method, such as `NavMenu.openUserMenu()`, are private too.
- Order in a class: the private getters first, then the public methods, then the private steps.
- Locators follow Playwright's preference: `getByRole` and `getByLabel` first.

### Language

Locators use the visible Dutch text, so the config fixes the browser language with `locale: 'nl-NL'`.

### Fixtures

Tests get their page objects from `fixtures/pages.ts` instead of creating them with `new`:

```ts
import { test } from '../fixtures/pages';

test.beforeEach(async ({ productPage, loginPage }) => {
  await productPage.goto();
  await productPage.menu.goToSignIn();
  await loginPage.expectLoaded();
});
```

- **Dependency inversion**: tests receive their page objects instead of constructing them.
- **Single responsibility**: creating page objects happens in one place.
- **Open/closed**: a new page is one extra fixture; existing tests do not change.
- **Lazy**: a fixture is only created when a test asks for it.

A fixture only creates the page object and never navigates. Navigation such as `productPage.goto()` stays visible in the test, so a reader can see where the test starts.

The `apiClient` fixture in `fixtures/api.ts` creates an `ApiClient` for `API_URL` and closes it after the test. A spec that needs both pages and the API combines the fixtures:

```ts
const test = mergeTests(pagesTest, apiTest);
```

### Test data

Every test user is based on one `User` type in `test-data/user.ts`. Every user can log in, so `firstName`, `lastName`, `email` and `password` are required; the other fields are optional.

- `test-data/users/` holds one file per test user, for example `totp-user.ts` and `registration-user-custom-address.ts`. Each user only fills in the fields its tests use.
- A user that fills in the whole registration form is typed as `Registration` (`Required<User>`, also in `test-data/user.ts`), so a forgotten field is a type error in the data file. `RegisterPage` and `ProfilePage` only accept such a complete user.
- The existing accounts `adminUser` and `customerUser` take their email address and password from `.env`, because those can differ per environment. Their names are stored in the user file.
- The display name is not stored; `fullName(user)` derives it from the first and last name.
- For new users, email addresses and passwords must be unique per run, so they come from `utils/unique-credentials.ts`. The user file sets them itself, so the test uses the user as is:

```ts
const user = registrationUserCustomAddress;
```

`uniqueEmail()` adds a counter to the timestamp, because user files are imported in the same millisecond and would otherwise get the same address.

### API helpers

Helpers that call the API live in `utils/api/`, for example `registerUser()`. Tests that change an account, such as enabling TOTP, register a new user through the API so the shared test accounts stay unchanged.

### TOTP

`utils/totp.ts` generates the code as described in RFC 6238 (SHA1, 6 digits, 30 seconds). `generateTotp()` calls one function per step, in the order the algorithm runs.

The code is calculated with the server's time instead of the local clock: `fetchServerTimeMs()` reads the `Date` header of an API response. The server only accepts codes up to 30 seconds off, and a local clock can easily differ more than that.

TOTP cannot be disabled on the site once it is enabled, so the TOTP test always uses a newly registered user.

### Registration

The registration tests do not stop at the redirect to the login page. After registering, the test logs in as the new user and checks the stored details on the profile page, so it proves the data was actually saved.

There are two tests:

- **Every field filled in**: the test fills in the street, city and state itself.
- **Required fields only**: the site looks up the address from the postcode and house number; the test checks the filled-in street, city and state before registering.

#### How `RegisterPage` is built

The page object follows the two tests:

```
Every field filled in                  Required fields only (steps in the test)
registerWithAllFields(user)            fillRequiredFields(user)
├── fillRequiredFields(user)           expectAutoFilledAddress(user)
├── fillOtherFields(user)  (private)   submit()
└── submit()
```

- **Every field filled in is one method**: nothing is checked during this flow, so the test registers in one line and reads as the scenario and not as a list of fields.
- **Required fields only is three steps in the test**: the check of the looked-up address is part of what this test verifies, so it stays visible in the test instead of being hidden inside an action. Actions and checks are not mixed in one method.
- **Check before submitting**: the looked-up address can only be checked while the form is still open, so the test calls `expectAutoFilledAddress()` before `submit()`.
- **Shared required fields**: both flows fill the same required fields, so they live in one method, `fillRequiredFields()`. The flows only differ in what happens to the street, city and state.
- **Street, city and state separately**: `fillOtherFields()` fills them in by hand; `expectAutoFilledAddress()` checks what the postcode lookup filled in. These are the only two places that touch those fields.
- **Order in the class**: the public methods come first, then the private steps in the order they are called.
- **One user object**: every method takes a `Registration` (`Required<User>`) instead of separate values, so the test data decides what is filled in and the type makes sure nothing is missing.
- **Waiting for the lookup is hidden**: `waitForAddressLookups()` is a private step of `fillRequiredFields()`. The test does not need to know that the form waits for an API response; see the workaround below. The wait starts before the postcode is filled in, so the response cannot arrive before Playwright listens for it.

### Known workaround: double postcode lookup

The site sends the postcode lookup twice. The second response overwrites a street, city and state that were already filled in, so `RegisterPage` waits for both lookups before it continues. This is marked as a workaround in two places:

- a `TODO` comment on `waitForAddressLookups()` in `pages/register-page.ts`;
- an `issue` annotation on the `Register` describe block, so it shows up in the test report.

Remove the workaround once it is confirmed that the double lookup is intended, or once it is fixed.
