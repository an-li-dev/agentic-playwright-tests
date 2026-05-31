# Onboarding Guide

Welcome! This guide walks you from a fresh clone to your first passing test. It assumes no prior knowledge of this framework.

---

## 1. Setup

```bash
bun install
bunx playwright install --with-deps
cp .env.example .env
```

Edit `.env`:

- `BASE_URL` — the app you're testing (e.g. `https://your-app.com`)
- `API_BASE_URL` — its API host (only needed for API / authenticated tests)
- `USER_EMAIL` / `USER_PASSWORD` / `USER_USERNAME` — only for authenticated tests

Verify the toolchain:

```bash
bun run check        # lint + format check should pass on a clean clone
bunx playwright test # nothing to run yet (only excluded templates exist) — that's expected
```

---

## 2. Mental model

```
test  ──uses──▶  fixture  ──provides──▶  Page Object  ──composes──▶  Component(s)
                                              │                          │
                                         extends BasePage          extends BaseComponent
```

- **Tests** describe behaviour. They never touch raw locators or `page.goto`.
- **Fixtures** (`src/fixtures/test.fixtures.ts`) construct and inject page/component objects.
- **Page Objects** (`src/pages/`) own routing + page-level concerns; they compose components.
- **Components** (`src/components/`) own the locators and interactions for one UI section.
- **Data** (`src/data/`) centralises URLs, patterns, UI strings, and tags.

**Golden rules**

1. In UI tests, import `test` / `expect` from `src/fixtures/test.fixtures.ts` — never from `@playwright/test`.
2. Never call `page.goto` in a test. Use a page object's `navigate()`.
3. Locators live in components, assertions can live in components or tests, business flows live in page/component methods.
4. Use `Tags` constants — never raw tag strings.
5. Use web-first assertions (`expect(locator).toBeVisible()`), never `page.waitForTimeout()`.

---

## 3. Create your first component

Copy the template:

```bash
cp src/components/TemplateComponent.ts src/components/LoginFormComponent.ts
```

Then in `LoginFormComponent.ts`:

1. Rename the class to `LoginFormComponent`.
2. Replace `[REPLACE_*]` placeholders with real locators (prefer `getByRole` / `getByLabel`).
3. Delete the banner comment block.

```ts
export class LoginFormComponent extends BaseComponent {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.click(this.submitButton);
    await this.waitForNavigation();
  }
}
```

---

## 4. Create your first page object

```bash
cp src/pages/TemplatePage.ts src/pages/LoginPage.ts
```

Compose the component and implement `navigate()`:

```ts
export class LoginPage extends BasePage {
  readonly loginForm: LoginFormComponent;

  constructor(page: Page) {
    super(page);
    this.loginForm = new LoginFormComponent(page);
  }

  async navigate(): Promise<void> {
    await this.goto(`${config.baseURL}${TestData.urls.login}`);
    await this.loginForm.submitButton.waitFor({ state: "visible" });
  }
}
```

Add the route to `src/data/test-data.ts` (`urls.login`) if it isn't there yet.

---

## 5. Register the fixture

In `src/fixtures/test.fixtures.ts`, add to `MyFixtures` and the `test.extend` block:

```ts
type MyFixtures = {
  loginPage: LoginPage;
  // …
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // …
});
```

---

## 6. Write the test

```bash
cp tests/ui/template-ui.spec.ts tests/ui/login.spec.ts
```

```ts
import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

test.describe("Login Page — Smoke Tests", { tag: [Tags.ui, Tags.smoke] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test(
    "should sign in with valid credentials",
    { tag: Tags.critical },
    async ({ loginPage, page }) => {
      await test.step("Submit valid credentials", async () => {
        const { email, password } = TestData.credentials.validUser;
        await loginPage.loginForm.login(email, password);
      });

      await test.step("Lands on the dashboard", async () => {
        await expect(page).toHaveURL(TestData.urlPatterns.dashboard);
      });
    },
  );
});
```

Run it:

```bash
bunx playwright test login.spec.ts --headed
```

---

## 7. API tests

Copy `tests/api/template-api.spec.ts`. API tests import `test`/`expect` directly from `@playwright/test` and use the built-in `request` fixture. Always assert **both** the status code and the body shape, and build the URL from `process.env.API_BASE_URL` + `TestData.api.*`.

---

## 8. Useful commands

| Command                   | What it does                        |
| ------------------------- | ----------------------------------- |
| `bun run test`            | All tests on Chromium               |
| `bun run test:smoke`      | `@smoke` tests only                 |
| `bun run test:headed`     | Run with a visible browser          |
| `bun run test:ui`         | Playwright UI mode (time-travel)    |
| `bun run test:report`     | Run + interactive Allure report     |
| `bun run lint` / `format` | Quality gates                       |
| `bun run codegen`         | Record selectors against `BASE_URL` |

---

## 9. Conventions checklist (before opening a PR)

- [ ] `test` / `expect` imported from fixtures (UI) or `@playwright/test` (API)
- [ ] No `page.goto` in tests — uses a page object `navigate()`
- [ ] Locators use `getByRole` / `getByLabel` / `getByText` / `getByTestId` (no brittle CSS/XPath)
- [ ] Web-first assertions only — no `page.waitForTimeout()`
- [ ] Tags applied via `Tags` constants
- [ ] `bun run check` passes
- [ ] No `template-*.spec.ts` left with placeholders in your feature
