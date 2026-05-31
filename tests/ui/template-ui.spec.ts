/**
 * ─────────────────────────────────────────────────────────────────────────────
 * UI TEST TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this file as a starting point when writing browser-based UI tests.
 *
 * NOTE: files named `template-*.spec.ts` are excluded from test runs via
 * `testIgnore` in playwright.config.ts — they contain unfilled placeholders.
 * COPY this file, rename it (e.g. `login.spec.ts`), then fill it in.
 *
 * Key concepts:
 *  • Import `test` and `expect` from the custom fixtures file — NEVER directly
 *    from `@playwright/test`. The fixture file extends the base `test` object
 *    with typed page-object and component fixtures (e.g. `templatePage`).
 *  • Structure every test with `test.step()` blocks. Steps produce named entries
 *    in the Allure report and Playwright HTML report, making failures easier to
 *    localise without reading the full stack trace.
 *  • Use `Tags` constants (never raw strings) to categorise tests. Tags control
 *    which tests run under which script / CI stage.
 *  • Never use `page.goto` directly in a test. Use the page object's `navigate()`
 *    method — it waits for the page to be interactive before returning.
 *  • Prefer fixture-based page objects over `new PageObject(page)` in tests,
 *    so setup/teardown is handled centrally.
 *
 * Filtering by tag on the command line:
 *   bunx playwright test --grep @smoke
 *   bunx playwright test --grep "@regression|@navigation"
 *   bunx playwright test --grep-invert @visual
 *
 * Docs & References:
 *  • Playwright test API    : https://playwright.dev/docs/api/class-test
 *  • expect assertions      : https://playwright.dev/docs/test-assertions
 *  • Fixtures               : https://playwright.dev/docs/test-fixtures
 *  • test.step()            : https://playwright.dev/docs/api/class-test#test-step
 *  • Allure Playwright      : https://allurereport.org/docs/playwright/
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Steps to adapt this template:
 *  1. Copy this file and rename it, e.g. `login.spec.ts`.
 *  2. Swap `templatePage` for the real page-object fixture you added.
 *  3. Replace every `[REPLACE_*]` placeholder with real values.
 *  4. Add / remove test cases as required.
 *  5. Delete this banner comment block once you're done.
 */

// ── Imports ───────────────────────────────────────────────────────────────────
// Always import from the custom fixtures file, NOT from '@playwright/test' directly.
import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Suite-level tags control which runs include this file.
 * Add `Tags.smoke` for critical paths, `Tags.regression` for full coverage.
 * See src/data/tags.ts for the full tag list.
 */
test.describe(
  "[REPLACE_SUITE_NAME] — [REPLACE_SUITE_TYPE] Tests", // e.g. "Login Page — Smoke Tests"
  { tag: [Tags.ui, Tags.smoke] },
  () => {
    // ── beforeEach ─────────────────────────────────────────────────────────────
    //
    // Use beforeEach to navigate to the starting URL and ensure the page is
    // loaded before every test. Page objects expose a `navigate()` method that
    // handles both navigation AND waiting for interactivity.
    test.beforeEach(async ({ templatePage }) => {
      // [REPLACE] Call navigate() on the page object that matches your test scope.
      await templatePage.navigate();
    });

    // ── Test cases ──────────────────────────────────────────────────────────────

    /**
     * Test: Verify the page loads successfully.
     *
     * Tag with `Tags.critical` for tests that MUST pass to unblock deployment.
     */
    test("should load page successfully", { tag: Tags.critical }, async ({ templatePage }) => {
      await test.step("Verify page is loaded", async () => {
        await templatePage.verifyPageLoaded();
      });

      await test.step("Verify page title", async () => {
        const title = await templatePage.getTitle();
        expect(title).toContain("[REPLACE_EXPECTED_TITLE]");
      });
    });

    /**
     * Test: Verify a key element is visible.
     *
     * Use expect(locator) matchers — they retry-with-timeout automatically
     * (up to the `actionTimeout` set in playwright.config.ts).
     */
    test("should display [REPLACE_ELEMENT_DESCRIPTION]", async ({ templatePage }) => {
      await test.step("Verify [REPLACE_ELEMENT_DESCRIPTION] is visible", async () => {
        // Access component locators via the page object:
        await expect(templatePage.templateComponent.primaryButton).toBeVisible();
      });
    });

    /**
     * Test: Verify user interaction — fill a field and assert an outcome.
     *
     * Use composite high-level methods from the component/page rather than
     * chaining low-level locator calls in the test body.
     */
    test("should [REPLACE_ACTION_DESCRIPTION]", async ({ templatePage }) => {
      await test.step("Perform [REPLACE_ACTION]", async () => {
        // [REPLACE] with the actual method call on the component or page:
        await templatePage.templateComponent.fillInputField("example value");
      });

      await test.step("Verify [REPLACE_EXPECTED_OUTCOME]", async () => {
        // [REPLACE] with an assertion against the expected post-action state:
        await expect(templatePage.templateComponent.statusMessage).toBeVisible();
      });
    });

    // ── Add more test cases above this line ───────────────────────────────────
  },
);
