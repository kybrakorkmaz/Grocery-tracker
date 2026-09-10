import { useGroceryStore } from "@/store/grocery-store";

/** Presenter: List screen state + actions for the signed-in user's items only. */
export function useGroceryListPresenter() {
    const items = useGroceryStore((state) => state.items);
    const isLoading = useGroceryStore((state) => state.isLoading);
    const error = useGroceryStore((state) => state.error);
    const loadItems = useGroceryStore((state) => state.loadItems);
    const removeItem = useGroceryStore((state) => state.removeItem);
    const updateQuantity = useGroceryStore((state) => state.updateQuantity);
    const togglePurchased = useGroceryStore((state) => state.togglePurchased);

    const pendingItems = items.filter((item) => !item.purchased);
    const completedItems = items.filter((item) => item.purchased);

    return {
        pendingItems,
        completedItems,
        pendingCount: pendingItems.length,
        isLoading,
        error,
        loadItems,
        removeItem,
        updateQuantity,
        togglePurchased,
    };
}
