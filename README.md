# Playwright Test Project

Automated tests built with Playwright and TypeScript.

## APIHelper

`APIHelper` is a standalone module for sending API requests, separate from the tests that use it.

**Goals**

- **Reusable**: any part of the test suite can create its own `ApiClient` or reuse one that has already been created.
- **Multi-application**: the same helper supports different applications; each `ApiClient` is created with the base URL of the application it targets.
- **Technology-independent**: tests only deal with a base URL, a path, a body and a plain result object. The underlying HTTP library (currently Playwright) is fully contained within `ApiClient`, so it can be replaced without changing any tests.
