import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";
import { requireAuthUser } from "@/lib/server/auth";
import { toGroceryItem } from "@/lib/server/mappers";
import { CreateItemSchema } from "@/lib/server/validation";
import { withErrorHandler } from "@/lib/server/error-handler";

export const GET = withErrorHandler(async (request: Request) => {
    const auth = await requireAuthUser(request);
    const rows = await listGroceryItems(auth.userId);
    return Response.json({ items: rows.map(toGroceryItem) });
});

export const POST = withErrorHandler(async (request: Request) => {
    const auth = await requireAuthUser(request);
    const body = await request.json();
    
    // Zod .parse() throws a ZodError if validation fails, which withErrorHandler catches.
    const { name, category, quantity, priority } = CreateItemSchema.parse(body);

    const row = await createGroceryItem({
        userId: auth.userId,
        name,
        category,
        quantity,
        priority,
    });

    return Response.json({ item: toGroceryItem(row) }, { status: 201 });
});
