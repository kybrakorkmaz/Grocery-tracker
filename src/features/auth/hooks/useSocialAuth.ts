import { useState } from "react";
import { Alert } from "react-native";
import { useSSO } from "@clerk/expo";
import type { OAuthStrategy } from "@clerk/types";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { AuthActionStrategy } from "../constants/authOptions";

export const useSocialAuth = () => {
    const [loadingStrategy, setLoadingStrategy] = useState<AuthActionStrategy | null>(null);
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const handleSocialAuth = async (strategy: AuthActionStrategy) => {
        if (loadingStrategy) return; // when one of the option is clicked prevent others while loading the clicked option sign-in page

        // 1. Imperative Navigation for Email Flow
        if (strategy === "email_login") {
            router.push("/(auth)/email-sign-in");
            return;
        }

        setLoadingStrategy(strategy);

        try {
            // 2. Deep link setup for OAuth
            const redirectUrl = AuthSession.makeRedirectUri();

            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: strategy as OAuthStrategy,
                redirectUrl,
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                return;
            }

            if (signUp || signIn) {
                Alert.alert(
                    "Action Required",
                    "Please complete your account setup to finish signing in."
                );
                return;
            }

            Alert.alert("Sign-in Incomplete", "Sign-in did not complete. Please try again.");
        } catch (error: any) {
            console.error(`[SocialAuth Error - ${strategy}]:`, error);

            const raw = (error && (error.message || (typeof error === 'string' ? error : ''))) || '';

            // Clerk returns a validation error like:
            // "oauth_google does not match one of the allowed values for parameter strategy"
            if (raw.includes('does not match one of the allowed values') && typeof strategy === 'string' && strategy.startsWith('oauth_')) {
                const provider = strategy.replace(/^oauth_/, '').replace('_', ' ');
                Alert.alert(
                    'Authentication Disabled',
                    `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not enabled in Clerk. Please enable the provider in your Clerk dashboard.`
                );
            } else {
                Alert.alert('Authentication Failed', 'Unable to sign in. Please try again.');
            }
        } finally {
            setLoadingStrategy(null);
        }
    };

    return {
        handleSocialAuth,
        loadingStrategy,
    };
};

export default useSocialAuth;