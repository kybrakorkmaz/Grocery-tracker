import { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import TabScreenBackground from "@/components/TabScreenBackground";
import { CompletedItems, ListHeroCard, PendingItemCard } from "@/features/list";
import { useGroceryListPresenter } from "@/features/list/presenters/useGroceryListPresenter";

export default function IndexScreen() {
    const {
        pendingItems,
        pendingCount,
        completedItems,
        loadItems,
        removeItem,
        updateQuantity,
        togglePurchased,
    } = useGroceryListPresenter();

    useEffect(() => {
        void loadItems();
    }, [loadItems]);

    return (
        <FlatList
            className="flex-1 bg-background "
            data={pendingItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <PendingItemCard
                    item={item}
                    onTogglePurchased={togglePurchased}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                />
            )}
            contentContainerStyle={{ padding: 20, gap: 14 }}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={
                <View style={{ gap: 14, paddingTop: 20 }}>
                    <TabScreenBackground />
                    <ListHeroCard />
                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
                            Shopping items
                        </Text>
                        <Text className="text-sm text-muted-foreground">{pendingCount} active</Text>
                    </View>
                </View>
            }
            ListFooterComponent={
                <CompletedItems
                    items={completedItems}
                    onTogglePurchased={togglePurchased}
                    onRemove={removeItem}
                />
            }
        />
    );
}
