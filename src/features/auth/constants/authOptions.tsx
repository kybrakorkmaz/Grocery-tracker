import React from 'react';
import { Image } from "expo-image";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import type { OAuthStrategy } from "@clerk/types";

// Auth action can be an OAuth strategy OR custom non-OAuth actions
export type AuthActionStrategy = OAuthStrategy | "email_login";

export interface SignInOption {
    id: string;
    strategy: AuthActionStrategy;
    label: string;
    loadingLabel: string;
    renderIcon: (props: { size?: number }) => React.ReactNode;
}

export const SIGN_IN_OPTIONS: SignInOption[] = [
    {
        id: "google",
        strategy: "oauth_google",
        label: "Continue with Google",
        loadingLabel: "Connecting Google...",
        renderIcon: ({ size = 20 }) => (
            <Image
                source={require("@/assets/images/google.png")}
                style={{ width: size, height: size }}
                contentFit="contain"
            />
        ),
    },
    {
        id: "github",
        strategy: "oauth_github",
        label: "Continue with GitHub",
        loadingLabel: "Connecting GitHub...",
        renderIcon: ({ size = 20 }) => (
            <Entypo name="github" size={24} color="#674ea7" />
        ),
    },
    {
        id: "email",
        strategy: "email_login",
        label: "Continue with Email",
        loadingLabel: "Connecting Email...",
        renderIcon: ({ size = 20 }) => (
            <Entypo name="mail" size={24} color="#38761d" />
        ),
    },
]