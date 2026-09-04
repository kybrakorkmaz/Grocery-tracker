import { useSocialAuth } from "@/features/auth";
import {Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { Image } from "expo-image";
import {SIGN_IN_OPTIONS} from "@/features/auth/constants/authOptions";
import {SignInButton} from "@/features/auth/components/SignInButton";

export default function SignInScreen(){
    const { handleSocialAuth, loadingStrategy } = useSocialAuth();
    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
            {/* decorative elements */}
            <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40"/>
            <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35"/>

            {/* Header Banner */}
            <View className="px-6 pt-4">
                <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground
                    uppercase font-mono dark:text-foreground">
                    Grocify
                </Text>
                <Text className="mt-1 text-center text-[14px] text-primary-foreground/80
                dark:text-foreground/75">
                    Plan Smarter. Shop happier.
                </Text>
                <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
                    <Image
                        source={require("@/assets/images/auth.png")}
                        style={{ width: "100%", height: 300 }}
                        contentFit="contain"
                    />
                </View>
            </View>
            {/* Action Sheet Section */}
            <View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
                <View className="self-center rounded-full bg-secondary px-3 py-1">
                    <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
                        Welcome Back
                    </Text>
                </View>

                <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                    Choose a social provider and jump right into your personalized grocery experience.
                </Text>

                {/* Option Iteration */}
                <View className="mt-6">
                    {SIGN_IN_OPTIONS.map((option) =>(
                        <SignInButton
                            key={option.id}
                            option={option}
                            loadingStrategy={loadingStrategy}
                            onPress={handleSocialAuth}
                        />
                    ))}
                </View>

                <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
                    By continuing, you agree to our Terms and Privacy Policy.
                </Text>
            </View>
        </SafeAreaView>
    )
}