import {
    deleteGroceryItem,
    setGroceryItemPurchased,
    updateGroceryItemQuantity,
} from "@/lib/server/db-actions";
import { requireAuthUser } from "@/lib/server/auth";
import { toGroceryItem } from "@/lib/server/mappers";
import { UpdateItemSchema } from "@/lib/server/validation";
import { ApiError, withErrorHandler } from "@/lib/server/error-handler";

type RouteContext = {
    params: { id: string };
};

export const PATCH = withErrorHandler(async (request: Request, context: RouteContext) => {
    const { id } = context.params;
    const auth = await requireAuthUser(request);
    const body = await request.json();

    const { quantity, purchased } = UpdateItemSchema.parse(body);

    const row = quantity !== undefined
        ? await updateGroceryItemQuantity(auth.userId, id, quantity)
        : await setGroceryItemPurchased(auth.userId, id, purchased ?? true);

    if (!row) throw new ApiError(404, "Item not found.");

    return Response.json({ item: toGroceryItem(row) });
});

export const DELETE = withErrorHandler(async (request: Request, context: RouteContext) => {
    const { id } = context.params;
    const auth = await requireAuthUser(request);

    const deleted = await deleteGroceryItem(auth.userId, id);
    if (!deleted) throw new ApiError(404, "Item not found.");

    return Response.json({ ok: true });
});
