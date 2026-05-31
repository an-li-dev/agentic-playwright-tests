import { TestDataError } from "../errors/test-errors";

/**
 * Asserts that an env variable is present and non-empty.
 * Throws TestDataError at runtime if the value is missing.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new TestDataError(key);
  return value;
}

/**
 * Central registry of all test data used across the suite.
 *
 * - Credential fields use `requireEnv` so a missing env variable
 *   produces a clear, actionable error instead of a cryptic assertion failure.
 * - Non-secret constants (URL paths, patterns, UI strings) are defined inline.
 *
 * This is a TEMPLATE — replace the example routes, patterns and UI strings
 * below with the ones for the application under test.
 */
export const TestData = {
  /**
   * User credentials — sourced exclusively from environment variables.
   * Never hard-code real values here.
   */
  credentials: {
    /** Returns credentials for the standard test account. Throws if env vars are absent. */
    get validUser() {
      return {
        email: requireEnv("USER_EMAIL"),
        password: requireEnv("USER_PASSWORD"),
        username: process.env.USER_USERNAME ?? "",
      };
    },
    /** A well-formed but intentionally invalid credential set for negative tests. */
    invalidUser: {
      email: "invalid-user@example.com",
      password: "WrongPassword123!",
    },
  },

  /**
   * URL path segments appended to `baseURL`.
   * Replace these examples with the routes of your application.
   */
  urls: {
    home: "/",
    login: "/login",
    dashboard: "/dashboard",
    profile: "/profile",
    settings: "/settings",
  },

  /**
   * Regex patterns used in `expect(page).toHaveURL()` assertions.
   * Patterns tolerate minor URL changes (query strings, trailing slashes).
   */
  urlPatterns: {
    home: /\/$/,
    login: /\/login/,
    dashboard: /\/dashboard/,
    profile: /\/profile/,
    settings: /\/settings/,
  },

  /**
   * API endpoint paths — combined with `apiBaseURL` from config.
   */
  api: {
    graphqlEndpoint: "/graphql",
    // restExample: "/api/v1/users",
  },

  /**
   * Expected text / label constants visible in the UI.
   * Centralising them here means a single copy-change fixes every assertion.
   */
  ui: {
    pageTitle: "[REPLACE_EXPECTED_TITLE]",
    cookie: {
      bannerText: "[REPLACE_COOKIE_BANNER_TEXT]",
      acceptLabel: "Accept",
    },
  },

  /**
   * Convenience timeout constants (ms) for explicit waits inside helpers.
   * Note: keep these in sync with playwright.config timeouts where possible.
   */
  timeouts: {
    short: 5_000,
    medium: 15_000,
    long: 30_000,
  },
} as const;
