import { type APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";
import { type AccountData, ACCOUNT_QUERY, SIGN_IN_MUTATION } from "../data/graphql-queries";
import { TestData } from "../data/test-data";
import { createLogger } from "../utils/logger";
import { ApiError, AuthenticationError } from "../errors/test-errors";

dotenv.config();

const log = createLogger("AuthHelper");

interface AuthResponse {
  success: boolean;
  cookies?: string;
  accountData?: AccountData;
}

/**
 * Perform API login and return authentication cookies.
 *
 * This is an EXAMPLE GraphQL sign-in flow. Adapt the endpoint, payload and
 * success check to match your application's authentication API (REST or GraphQL).
 */
export async function loginViaAPI(request: APIRequestContext): Promise<AuthResponse> {
  const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  try {
    const response = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: SIGN_IN_MUTATION,
        variables: {
          email: userEmail,
          password: userPassword,
        },
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok()) {
      throw new ApiError(response.status(), "SignIn mutation returned a non-2xx response", apiUrl);
    }

    const responseData = await response.json();

    if (responseData.data?.signIn === true) {
      const cookies = response.headers()["set-cookie"];
      log.info("API authentication successful");
      return { success: true, cookies };
    }

    const gqlErrors = responseData.errors?.map((e: { message: string }) => e.message).join("; ");
    log.warn("API authentication rejected by server", { errors: gqlErrors });
    return { success: false };
  } catch (error) {
    if (error instanceof ApiError || error instanceof AuthenticationError) {
      throw error;
    }
    log.error("API login request failed unexpectedly", error);
    return { success: false };
  }
}

/**
 * Get account information after authentication (example).
 */
export async function getAccountInfo(request: APIRequestContext): Promise<AccountData | null> {
  const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;

  try {
    const response = await request.post(apiUrl, {
      data: {
        operationName: "Account",
        query: ACCOUNT_QUERY,
        variables: {},
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const responseData = await response.json();
    return responseData.data?.account ?? null;
  } catch (error) {
    log.error("Failed to retrieve account info", error);
    return null;
  }
}
