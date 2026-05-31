/**
 * Centralised tag registry for Playwright tests.
 *
 * Using constants instead of raw strings prevents typos, enables
 * IDE autocomplete, and gives a single place to rename a tag.
 *
 * Usage in tests:
 * @example
 *   import { Tags } from '../../src/data/tags';
 *
 *   test.describe('Login Page', { tag: Tags.ui }, () => {
 *     test('should sign in', { tag: [Tags.smoke, Tags.critical] }, async ({ page }) => { ... });
 *   });
 *
 * Filtering on the command line:
 *   bunx playwright test --grep @smoke
 *   bunx playwright test --grep "@smoke|@api"
 *   bunx playwright test --grep-invert @visual
 */

export const Tags = {
  /** Core user-facing paths — run on every build. */
  smoke: "@smoke",

  /** Full regression suite — run nightly or before releases. */
  regression: "@regression",

  /** Any test that drives the browser. */
  ui: "@ui",

  /** Tests that exercise API endpoints directly. */
  api: "@api",

  /** Must-pass scenarios; failure blocks the pipeline. */
  critical: "@critical",

  /** Header / footer / side-bar navigation flows. */
  navigation: "@navigation",

  /** Screenshot / pixel-diff tests. */
  visual: "@visual",

  /** Tests that require an authenticated session. */
  authenticated: "@authenticated",

  /** Authentication-specific tests (login, logout, session). */
  auth: "@auth",

  /** Cookie / consent banner tests. */
  cookie: "@cookie",

  /** Responsive / mobile-viewport tests (run by the `mobile-chrome` project). */
  responsive: "@responsive",

  /** Page performance / load-time checks. */
  performance: "@performance",

  /** Accessibility checks. */
  a11y: "@a11y",

  // ── Add your own feature/section tags below ────────────────────────────────
  // Keep them grouped and documented. Example:
  //   checkout: "@checkout",
  //   profile: "@profile",
} as const;

export type Tag = (typeof Tags)[keyof typeof Tags];
