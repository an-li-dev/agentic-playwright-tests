import { test as base, type Page } from "@playwright/test";
import { TemplatePage } from "../pages/TemplatePage";
import { TemplateComponent } from "../components/TemplateComponent";
import { loginViaAPI } from "../helpers/auth.helper";
import { AuthenticationError } from "../errors/test-errors";
import { createLogger } from "../utils/logger";

const log = createLogger("Fixtures");

/**
 * Custom fixture types.
 *
 * Add one entry per page object / component you want to inject into tests.
 * The keys here become the names you destructure in test signatures, e.g.
 *   test("...", async ({ templatePage }) => { ... });
 *
 * As you build real pages, replace `TemplatePage` / `TemplateComponent` with
 * your own (e.g. `loginPage: LoginPage`, `navigation: NavigationComponent`).
 */
type MyFixtures = {
  // ── Page Object fixtures ──────────────────────────────────────────────────
  templatePage: TemplatePage;

  // ── Component fixtures (inject a single component for focused tests) ───────
  templateComponent: TemplateComponent;

  // ── Authenticated session ─────────────────────────────────────────────────
  authenticatedPage: Page;

  // ── Auto fixture — not used directly in tests ─────────────────────────────
  screenshotOnFailure: void;
};

export const test = base.extend<MyFixtures>({
  /**
   * Auto-fixture: captures a full-page screenshot after every FAILED test and
   * attaches it via testInfo.attach() so that allure-playwright always includes
   * it in the Allure report (Playwright's built-in screenshot mechanism writes
   * the file too late for allure-playwright to pick up automatically).
   */
  screenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true }).catch(() => null);
        if (screenshot) {
          await testInfo.attach("screenshot on failure", {
            body: screenshot,
            contentType: "image/png",
          });
          log.info(`Screenshot attached for failed test: ${testInfo.title}`);
        }
      }
    },
    { auto: true },
  ],

  templatePage: async ({ page }, use) => {
    await use(new TemplatePage(page));
  },

  templateComponent: async ({ page }, use) => {
    await use(new TemplateComponent(page));
  },

  /**
   * Provides a page that already has an authenticated session.
   * Reuses the standard `page` fixture (best practice) so that the
   * screenshotOnFailure auto-fixture, video recording, and trace all operate
   * on the same page the test uses — no blank screenshots.
   */
  authenticatedPage: async ({ page, context }, use) => {
    const apiContext = context.request;
    const authResult = await loginViaAPI(apiContext);

    if (!authResult.success) {
      throw new AuthenticationError(
        "loginViaAPI returned success=false. Check USER_EMAIL and USER_PASSWORD env vars.",
      );
    }

    log.info("Authenticated via API — proceeding with test");
    // Cookies are already set in the context; the page will use them.
    await use(page);
  },
});

export { expect } from "@playwright/test";
