import type { CreateItemInput } from "@/features/grocery/model/types";
import { useGroceryStore } from "@/store/grocery-store";

/** Presenter: Planner form + pending summary for the signed-in user. */
export function usePlannerPresenter() {
    const items = useGroceryStore((state) => state.items);
    const error = useGroceryStore((state) => state.error);
    const addItem = useGroceryStore((state) => state.addItem);

    const pendingItems = items.filter((item) => !item.purchased);
    const pendingCount = pendingItems.length;
    const highPriorityCount = pendingItems.filter((item) => item.priority === "high").length;
    const totalQuantity = pendingItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
        pendingCount,
        highPriorityCount,
        totalQuantity,
        error,
        addItem: (input: CreateItemInput) => addItem(input),
    };
}
