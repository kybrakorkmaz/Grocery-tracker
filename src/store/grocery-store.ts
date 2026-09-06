import { create } from "zustand";
import { groceryRepository } from "@/features/grocery/model/grocery-repository";
import type { CreateItemInput, GroceryItem } from "@/features/grocery/model/types";

export type { CreateItemInput, GroceryCategory, GroceryItem, GroceryPriority } from "@/features/grocery/model/types";

type GroceryStore = {
    items: GroceryItem[];
    isLoading: boolean;
    error: string | null;
    loadItems: () => Promise<void>;
    addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    togglePurchased: (id: string) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clearPurchased: () => Promise<void>;
    reset: () => void;
};

export const useGroceryStore = create<GroceryStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    reset: () => set({ items: [], isLoading: false, error: null }),

    loadItems: async () => {
        set({ isLoading: true, error: null });
        try {
            const items = await groceryRepository.list();
            set({ items });
        } catch (error) {
            console.error("Error loading items:", error);
            set({ error: "Something went wrong" });
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (input) => {
        set({ error: null });
        try {
            const item = await groceryRepository.create(input);
            set((state) => ({ items: [item, ...state.items] }));
            return item;
        } catch (error) {
            console.error("Error adding item:", error);
            set({ error: "Something went wrong" });
        }
    },

    updateQuantity: async (id, quantity) => {
        set({ error: null });
        try {
            const item = await groceryRepository.updateQuantity(id, quantity);
            set((state) => ({
                items: state.items.map((current) => (current.id === id ? item : current)),
            }));
        } catch (error) {
            console.error("Error updating quantity:", error);
            set({ error: "Something went wrong" });
        }
    },

    togglePurchased: async (id) => {
        const currentItem = get().items.find((item) => item.id === id);
        if (!currentItem) return;

        set({ error: null });
        try {
            const item = await groceryRepository.setPurchased(id, !currentItem.purchased);
            set((state) => ({
                items: state.items.map((current) => (current.id === id ? item : current)),
            }));
        } catch (error) {
            console.error("Error toggling purchased:", error);
            set({ error: "Something went wrong" });
        }
    },

    removeItem: async (id) => {
        set({ error: null });
        try {
            await groceryRepository.remove(id);
            set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
        } catch (error) {
            console.error("Error removing item:", error);
            set({ error: "Something went wrong" });
        }
    },

    clearPurchased: async () => {
        set({ error: null });
        try {
            await groceryRepository.clearPurchased();
            set((state) => ({ items: state.items.filter((item) => !item.purchased) }));
        } catch (error) {
            console.error("Error clearing purchased:", error);
            set({ error: "Something went wrong" });
        }
    },
}));
