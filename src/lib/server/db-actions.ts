import { groceryItems } from "@/lib/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/server/db/client";

export const listGroceryItems = async (userId: string) => {
    return db
        .select()
        .from(groceryItems)
        .where(eq(groceryItems.userId, userId))
        .orderBy(desc(groceryItems.updated_at));
};

export const createGroceryItem = async (input: {
    userId: string;
    name: string;
    category: string;
    quantity: number;
    priority: string;
}) => {
    const rows = await db
        .insert(groceryItems)
        .values({
            id: crypto.randomUUID(),
            userId: input.userId,
            name: input.name,
            category: input.category,
            quantity: Math.max(1, input.quantity),
            purchased: false,
            priority: input.priority,
            updated_at: Date.now(),
        })
        .returning();

    return rows[0];
};

export const setGroceryItemPurchased = async (
    userId: string,
    id: string,
    purchased: boolean,
) => {
    const rows = await db
        .update(groceryItems)
        .set({ purchased, updated_at: Date.now() })
        .where(and(eq(groceryItems.id, id), eq(groceryItems.userId, userId)))
        .returning();

    if (!rows.length) return null;
    return rows[0];
};

export const updateGroceryItemQuantity = async (
    userId: string,
    id: string,
    quantity: number,
) => {
    const rows = await db
        .update(groceryItems)
        .set({ quantity: Math.max(1, Math.floor(quantity)), updated_at: Date.now() })
        .where(and(eq(groceryItems.id, id), eq(groceryItems.userId, userId)))
        .returning();

    if (!rows.length) return null;
    return rows[0];
};

export const deleteGroceryItem = async (userId: string, id: string) => {
    const rows = await db
        .delete(groceryItems)
        .where(and(eq(groceryItems.id, id), eq(groceryItems.userId, userId)))
        .returning({ id: groceryItems.id });

    return rows.length > 0;
};

export const clearPurchasedItems = async (userId: string) => {
    await db
        .delete(groceryItems)
        .where(and(eq(groceryItems.userId, userId), eq(groceryItems.purchased, true)));
};
