import { createClerkClient } from "@clerk/backend";

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
 * Returns the authenticated Clerk user id, or a 401 Response.
 */
export async function requireAuthUser(request: Request): Promise<AuthUser | Response> {
    const clerkClient = getClerkClient();
    const requestState = await clerkClient.authenticateRequest(request);

    if (!requestState.isAuthenticated) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = requestState.toAuth();
    if (!auth.userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return { userId: auth.userId };
}

export function isAuthError(result: AuthUser | Response): result is Response {
    return result instanceof Response;
}
