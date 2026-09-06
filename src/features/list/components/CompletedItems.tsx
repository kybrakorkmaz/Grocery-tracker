import type { GroceryItem } from "@/features/grocery/model/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type CompletedItemsProps = {
    items: GroceryItem[];
    onTogglePurchased: (id: string) => void;
    onRemove: (id: string) => void;
};

const CompletedItems = ({ items, onTogglePurchased, onRemove }: CompletedItemsProps) => {
    if (!items.length) return null;

    return (
        <View className="mt-3 rounded-3xl border border-border bg-secondary p-4">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-secondary-foreground">
                Completed
            </Text>

            {items.map((item) => (
                <View
                    key={item.id}
                    className="mt-3 flex-row items-center justify-between rounded-2xl border border-border bg-card px-3 py-2"
                >
                    <View className="flex-row items-center gap-2">
                        <Pressable
                            onPress={() => onTogglePurchased(item.id)}
                            className="h-6 w-6 items-center justify-center rounded-full bg-primary"
                        >
                            <FontAwesome6 name="check" size={12} color="#ffffff" />
                        </Pressable>
                        <Text className="text-base text-muted-foreground line-through">{item.name}</Text>
                    </View>

                    <Pressable
                        onPress={() => onRemove(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-xl bg-destructive"
                    >
                        <FontAwesome6 name="trash" size={12} color="#d45f58" />
                    </Pressable>
                </View>
            ))}
        </View>
    );
};
export default CompletedItems;
