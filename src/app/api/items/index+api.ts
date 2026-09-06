import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";
import { isAuthError, requireAuthUser } from "@/lib/server/auth";
import { toGroceryItem } from "@/lib/server/mappers";

export async function GET(request: Request) {
    try {
        const auth = await requireAuthUser(request);
        if (isAuthError(auth)) return auth;

        const rows = await listGroceryItems(auth.userId);
        return Response.json({ items: rows.map(toGroceryItem) });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch items";
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAuthUser(request);
        if (isAuthError(auth)) return auth;

        const body = await request.json();
        const { name, category, quantity, priority } = body;

        if (!name || !category || !priority) {
            return Response.json({ error: "Please provide all required fields." }, { status: 400 });
        }

        const row = await createGroceryItem({
            userId: auth.userId,
            name,
            category,
            quantity,
            priority,
        });

        return Response.json({ item: toGroceryItem(row) }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create item";
        return Response.json({ error: message }, { status: 500 });
    }
}
