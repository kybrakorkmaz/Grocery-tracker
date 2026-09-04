import React from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SignInOption, AuthActionStrategy} from "../constants/authOptions";

interface SignInButtonProps {
    option: SignInOption;
    loadingStrategy: string | null;
    onPress: (strategy: AuthActionStrategy) => void;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
    option,
    loadingStrategy,
    onPress,
}) => {
    const isLoading= loadingStrategy !== null;
    const isCurrentActive = loadingStrategy === option.strategy;

    return(
        <Pressable
            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-80 ${
                isLoading ? "opacity-60" : ""
            }`}
            disabled={isLoading}
            onPress={() => onPress(option.strategy)}
        >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-muted/50">
                {option.renderIcon({ size: 22 })}
            </View>

            <Text className="ml-3 flex-1 text-base font-semibold text-card-foreground">
                {isCurrentActive ? option.loadingLabel : option.label}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#6B7280" />
        </Pressable>
    )
}