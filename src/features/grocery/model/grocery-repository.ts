import { authFetch } from "@/lib/api/auth-fetch";
import type { CreateItemInput, GroceryItem } from "@/features/grocery/model/types";

type ItemsResponse = { items: GroceryItem[] };
type ItemResponse = { item: GroceryItem };

async function parseJson<T>(res: Response): Promise<T> {
    return (await res.json()) as T;
}

/** Model repository — sole client entry point for grocery CRUD APIs. */
export const groceryRepository = {
    async list(): Promise<GroceryItem[]> {
        const res = await authFetch("/api/items");
        const payload = await parseJson<ItemsResponse>(res);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return payload.items;
    },

    async create(input: CreateItemInput): Promise<GroceryItem> {
        const res = await authFetch("/api/items", {
            method: "POST",
            json: {
                name: input.name,
                category: input.category,
                quantity: Math.max(1, input.quantity),
                priority: input.priority,
            },
        });
        const payload = await parseJson<ItemResponse>(res);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return payload.item;
    },

    async updateQuantity(id: string, quantity: number): Promise<GroceryItem> {
        const res = await authFetch(`/api/items/${id}`, {
            method: "PATCH",
            json: { quantity: Math.max(1, quantity) },
        });
        const payload = await parseJson<ItemResponse>(res);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return payload.item;
    },

    async setPurchased(id: string, purchased: boolean): Promise<GroceryItem> {
        const res = await authFetch(`/api/items/${id}`, {
            method: "PATCH",
            json: { purchased },
        });
        const payload = await parseJson<ItemResponse>(res);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return payload.item;
    },

    async remove(id: string): Promise<void> {
        const res = await authFetch(`/api/items/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
    },

    async clearPurchased(): Promise<void> {
        const res = await authFetch("/api/items/clear-purchased", { method: "POST" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
    },
};
