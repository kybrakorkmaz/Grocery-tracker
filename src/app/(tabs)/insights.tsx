import {
    ClearCompletedButton,
    InsightsCategorySection,
    InsightsPrioritySection,
    InsightsStatsSection,
    SentryFeedbackButton,
    UserProfile,
} from "@/features/insights";
import TabScreenBackground from "@/components/TabScreenBackground";
import { ScrollView } from "react-native";

const InsightsScreen = () => {
    return (
        <>
            <ScrollView
                className="flex-1 bg-background py-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, gap: 14 }}
                contentInsetAdjustmentBehavior="automatic"
            >
                <TabScreenBackground />

                <UserProfile />
                <InsightsStatsSection />
                <InsightsCategorySection />
                <InsightsPrioritySection />
                <ClearCompletedButton />
            </ScrollView>

            <SentryFeedbackButton />
        </>
    );
};

export default InsightsScreen;