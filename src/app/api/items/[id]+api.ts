import {
    deleteGroceryItem,
    setGroceryItemPurchased,
    updateGroceryItemQuantity,
} from "@/lib/server/db-actions";
import { isAuthError, requireAuthUser } from "@/lib/server/auth";
import { toGroceryItem } from "@/lib/server/mappers";

export async function PATCH(request: Request, { id }: { id: string }) {
    try {
        const auth = await requireAuthUser(request);
        if (isAuthError(auth)) return auth;

        const body = await request.json();

        const row = body.quantity
            ? await updateGroceryItemQuantity(auth.userId, id, body.quantity)
            : await setGroceryItemPurchased(auth.userId, id, body.purchased ?? true);

        if (!row) return Response.json({ error: "Item not found." }, { status: 404 });

        return Response.json({ item: toGroceryItem(row) });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update item";
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { id }: { id: string }) {
    try {
        const auth = await requireAuthUser(request);
        if (isAuthError(auth)) return auth;

        const deleted = await deleteGroceryItem(auth.userId, id);
        if (!deleted) return Response.json({ error: "Item not found." }, { status: 404 });

        return Response.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete item";
        return Response.json({ error: message }, { status: 500 });
    }
}
