type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

/** Bind Clerk `getToken` from a React tree so the Model layer can attach Bearer tokens. */
export function bindAuthTokenGetter(getter: TokenGetter | null) {
    tokenGetter = getter;
}

export async function getAuthHeaders(): Promise<HeadersInit> {
    const token = tokenGetter ? await tokenGetter() : null;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}
