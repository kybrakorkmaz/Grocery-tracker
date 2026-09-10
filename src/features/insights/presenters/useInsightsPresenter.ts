import { useGroceryStore } from "@/store/grocery-store";

/** Presenter: Insights aggregates + clear action for the signed-in user's list. */
export function useInsightsPresenter() {
    const items = useGroceryStore((state) => state.items);
    const clearPurchased = useGroceryStore((state) => state.clearPurchased);

    const totalItems = items.length;
    const completedItems = items.filter((item) => item.purchased).length;
    const pendingItems = totalItems - completedItems;
    const completionRate = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

    const categories = items.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + 1;
        return acc;
    }, {});
    const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    const highPriorityRemaining = items.filter(
        (item) => item.priority === "high" && !item.purchased,
    ).length;

    return {
        totalItems,
        completedItems,
        pendingItems,
        completionRate,
        categoryEntries,
        highPriorityRemaining,
        clearPurchased,
    };
}
