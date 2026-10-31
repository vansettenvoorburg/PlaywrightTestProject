# Playwright Test Project

Automated tests built with Playwright and TypeScript.

## APIHelper

`api-helper` is a standalone module for sending API requests, separate from the tests that use it.

**Goals**

- **Reusable**: any part of the test suite can create its own `ApiClient` or reuse one that has already been created.
- **Multi-application**: the same helper supports different applications; each `ApiClient` is created with the base URL of the application it targets.
- **Technology-independent**: tests only deal with a base URL, a path, a body and a plain result object. The underlying HTTP library (currently Playwright) is fully contained within `ApiClient`, so it can be replaced without changing any tests.

**Status check**

`get()` and `post()` accept an optional `expectedStatus`. With a different status, the request throws an error with the method, path, status and response body, for example `POST /users/login returned status 500, expected 200: {...}`. Without `expectedStatus`, the result is returned as it is, so a test can check an error status itself.

```ts
await apiClient.post('/users/register', body, { expectedStatus: 201 });
```
