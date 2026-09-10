import { clearPurchasedItems } from "@/lib/server/db-actions";
import { requireAuthUser } from "@/lib/server/auth";
import { withErrorHandler } from "@/lib/server/error-handler";

export const POST = withErrorHandler(async (request: Request) => {
    const auth = await requireAuthUser(request);
    await clearPurchasedItems(auth.userId);
    return Response.json({ ok: true });
});
