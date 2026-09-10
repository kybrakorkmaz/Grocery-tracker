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

export const useGroceryStore = create<GroceryStore>((set, get) => {
    let sessionGeneration = 0;

    return {
        items: [],
        isLoading: false,
        error: null,

        reset: () => {
            sessionGeneration += 1;
            set({ items: [], isLoading: false, error: null });
        },

        loadItems: async () => {
            const generation = sessionGeneration;
            set({ isLoading: true, error: null });
            try {
                const items = await groceryRepository.list();
                if (generation !== sessionGeneration) return;
                set({ items });
            } catch (error) {
                console.error("Error loading items:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            } finally {
                if (generation === sessionGeneration) {
                    set({ isLoading: false });
                }
            }
        },

        addItem: async (input) => {
            const generation = sessionGeneration;
            set({ error: null });
            try {
                const item = await groceryRepository.create(input);
                if (generation !== sessionGeneration) return;
                set((state) => ({ items: [item, ...state.items] }));
                return item;
            } catch (error) {
                console.error("Error adding item:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            }
        },

        updateQuantity: async (id, quantity) => {
            const generation = sessionGeneration;
            set({ error: null });
            try {
                const item = await groceryRepository.updateQuantity(id, quantity);
                if (generation !== sessionGeneration) return;
                set((state) => ({
                    items: state.items.map((current) => (current.id === id ? item : current)),
                }));
            } catch (error) {
                console.error("Error updating quantity:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            }
        },

        togglePurchased: async (id) => {
            const currentItem = get().items.find((item) => item.id === id);
            if (!currentItem) return;

            const generation = sessionGeneration;
            set({ error: null });
            try {
                const item = await groceryRepository.setPurchased(id, !currentItem.purchased);
                if (generation !== sessionGeneration) return;
                set((state) => ({
                    items: state.items.map((current) => (current.id === id ? item : current)),
                }));
            } catch (error) {
                console.error("Error toggling purchased:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            }
        },

        removeItem: async (id) => {
            const generation = sessionGeneration;
            set({ error: null });
            try {
                await groceryRepository.remove(id);
                if (generation !== sessionGeneration) return;
                set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
            } catch (error) {
                console.error("Error removing item:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            }
        },

        clearPurchased: async () => {
            const generation = sessionGeneration;
            set({ error: null });
            try {
                await groceryRepository.clearPurchased();
                if (generation !== sessionGeneration) return;
                set((state) => ({ items: state.items.filter((item) => !item.purchased) }));
            } catch (error) {
                console.error("Error clearing purchased:", error);
                if (generation !== sessionGeneration) return;
                set({ error: "Something went wrong" });
            }
        },
    };
});
