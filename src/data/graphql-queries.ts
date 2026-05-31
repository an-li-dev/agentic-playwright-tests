/**
 * Centralised GraphQL operation strings and related TypeScript types.
 *
 * Keeping mutations/queries here guarantees a single source of truth:
 * if the schema changes, one edit fixes auth.helper.ts and every spec file
 * that uses these operations.
 *
 * This is a TEMPLATE example. If your application uses REST instead of GraphQL,
 * delete this file and call `request.get/post(...)` directly in your specs and
 * helpers. If it uses GraphQL, replace the operations below with your real ones.
 *
 * Import pattern:
 *   import { SIGN_IN_MUTATION, ACCOUNT_QUERY } from '../data/graphql-queries';
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Shape of the `account` object returned by the API (example). */
export interface AccountData {
  id: string;
  email: string;
  username: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Authenticates a user and sets session cookies (example operation).
 * Returns `true` on success, `false` (or `errors`) on failure.
 */
export const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches account fields for the currently authenticated user (example).
 * Requires a valid session cookie (obtained via SIGN_IN_MUTATION).
 */
export const ACCOUNT_QUERY = `
  query Account {
    account {
      id
      email
      username
    }
  }
`;
