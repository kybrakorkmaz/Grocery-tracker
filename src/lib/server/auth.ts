import { createClerkClient } from "@clerk/backend";
import { ApiError } from "./error-handler";

export type AuthUser = {
    userId: string;
};

function getClerkClient() {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!secretKey) {
        throw new Error("CLERK_SECRET_KEY is required for API route authentication");
    }

    if (!publishableKey) {
        throw new Error(
            "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required for API route authentication",
        );
    }

    return createClerkClient({
        secretKey,
        publishableKey,
    });
}

/**
 * Verifies the Clerk session JWT from the Authorization header.
 * Throws an ApiError (401) if authentication fails.
 */
export async function requireAuthUser(request: Request): Promise<AuthUser> {
    const clerkClient = getClerkClient();
    const requestState = await clerkClient.authenticateRequest(request);

    if (!requestState.isAuthenticated) {
        throw new ApiError(401, "Unauthorized");
    }

    const auth = requestState.toAuth();
    if (!auth.userId) {
        throw new ApiError(401, "Unauthorized");
    }

    return { userId: auth.userId };
}
