import type { GroceryItem } from "@/features/grocery/model/types";

/** Map DB rows to the public client Model (never expose other users' ids via leaky fields). */
export function toGroceryItem(row: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    purchased: boolean;
    priority: string;
}): GroceryItem {
    return {
        id: row.id,
        name: row.name,
        category: row.category as GroceryItem["category"],
        quantity: row.quantity,
        purchased: row.purchased,
        priority: row.priority as GroceryItem["priority"],
    };
}
