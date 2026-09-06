import { getAuthHeaders } from "@/lib/api/auth-token";

type AuthFetchOptions = Omit<RequestInit, "headers"> & {
    headers?: HeadersInit;
    json?: unknown;
};

/**
 * Authenticated fetch for grocery Model API calls.
 * Always attaches the Clerk session token; never sends unscoped requests.
 */
export async function authFetch(input: string, options: AuthFetchOptions = {}) {
    const authHeaders = await getAuthHeaders();
    const headers = new Headers(options.headers);

    Object.entries(authHeaders).forEach(([key, value]) => {
        headers.set(key, String(value));
    });

    let body = options.body;
    if (options.json !== undefined) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(options.json);
    }

    return fetch(input, {
        ...options,
        headers,
        body,
    });
}
