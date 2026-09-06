import { clearPurchasedItems } from "@/lib/server/db-actions";
import { isAuthError, requireAuthUser } from "@/lib/server/auth";

export async function POST(request: Request) {
    try {
        const auth = await requireAuthUser(request);
        if (isAuthError(auth)) return auth;

        await clearPurchasedItems(auth.userId);
        return Response.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to clear completed items";
        return Response.json({ error: message }, { status: 500 });
    }
}
