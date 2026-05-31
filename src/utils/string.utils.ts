/**
 * General-purpose string and date utilities.
 * No Playwright dependencies — safe to use anywhere in the codebase.
 */

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique-ish email for sign-up / negative tests.
 */
export function randomEmail(domain: string = "example.com"): string {
  return `test-${randomString(8).toLowerCase()}@${domain}`;
}

/**
 * Format date to string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get current timestamp, filesystem-safe (no colons or dots).
 */
export function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
