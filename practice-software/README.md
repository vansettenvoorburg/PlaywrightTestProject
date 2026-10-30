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
- Each element is a getter that returns a locator, so every locator is defined in one place.
- Actions and checks are methods that use those getters, for example `login()` and `expectLoaded()`.
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

The `api` fixture in `fixtures/api.ts` creates an `ApiClient` for `API_URL` and closes it after the test. A spec that needs both pages and the API combines the fixtures:

```ts
const test = mergeTests(pagesTest, apiTest);
```

### Test data

- `test-data/` holds fixed data as plain objects, for example `totpUser` with a first and last name.
- Values that must be unique per run, such as an email address and password, come from `utils/unique-credentials.ts` and are added in the test:

```ts
const user = { ...totpUser, email: uniqueEmail(), password: uniquePassword() };
```

### API helpers

Helpers that call the API live in `utils/api/`, for example `registerUser()`. Tests that change an account, such as enabling TOTP, register a new user through the API so the shared test accounts stay unchanged.

### TOTP

`utils/totp.ts` generates the code as described in RFC 6238 (SHA1, 6 digits, 30 seconds). `generateTotp()` calls one function per step, in the order the algorithm runs.

The code is calculated with the server's time instead of the local clock: `fetchServerTimeMs()` reads the `Date` header of an API response. The server only accepts codes up to 30 seconds off, and a local clock can easily differ more than that.

TOTP cannot be disabled on the site once it is enabled, so the TOTP test always uses a newly registered user.
