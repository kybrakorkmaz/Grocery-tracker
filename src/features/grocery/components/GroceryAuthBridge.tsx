import { useAuth } from "@clerk/expo";
import { useEffect, useRef } from "react";
import { bindAuthTokenGetter } from "@/lib/api/auth-token";
import { useGroceryStore } from "@/store/grocery-store";

/**
 * Bridges Clerk session → Model auth headers and scopes the grocery Model to the signed-in user.
 * Must mount inside ClerkProvider after the user is signed in.
 */
export function GroceryAuthBridge() {
    const { getToken, userId, isSignedIn } = useAuth();
    const reset = useGroceryStore((state) => state.reset);
    const loadItems = useGroceryStore((state) => state.loadItems);
    const lastUserId = useRef<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) {
            bindAuthTokenGetter(null);
            return;
        }

        bindAuthTokenGetter(() => getToken());
        return () => bindAuthTokenGetter(null);
    }, [getToken, isSignedIn]);

    useEffect(() => {
        if (!isSignedIn || !userId) {
            lastUserId.current = null;
            reset();
            return;
        }

        if (lastUserId.current === userId) return;

        lastUserId.current = userId;
        reset();
        void loadItems();
    }, [isSignedIn, userId, reset, loadItems]);

    return null;
}
