import { useInsightsPresenter } from "@/features/insights/presenters/useInsightsPresenter";
import { Text, View } from "react-native";

export default function InsightsPrioritySection() {
    const { highPriorityRemaining } = useInsightsPresenter();

    const highPriorityTone =
        highPriorityRemaining === 0
            ? "Everything critical is covered."
            : "Handle these first for a smoother trip.";

    return (
        <View className="rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">High priority remaining</Text>
                <View
                    className={`rounded-full px-3 py-1 ${
                        highPriorityRemaining ? "bg-priority-high" : "bg-priority-low"
                    }`}
                >
                    <Text
                        className={`text-xs font-bold uppercase ${
                            highPriorityRemaining
                                ? "text-priority-high-foreground"
                                : "text-priority-low-foreground"
                        }`}
                    >
                        {highPriorityRemaining ? "Action" : "Clear"}
                    </Text>
                </View>
            </View>
            <Text className="mt-1 text-3xl font-extrabold text-foreground">{highPriorityRemaining}</Text>
            <Text className="mt-1 text-sm text-muted-foreground">{highPriorityTone}</Text>
        </View>
    );
}
