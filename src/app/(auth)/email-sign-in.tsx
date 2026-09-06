import React, {useRef, useState} from "react";
import {Text, TextInput, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useAuth} from "@clerk/expo";
import {Link, Redirect} from "expo-router";


export default function EmailSignInScreen() {
    const {isSignedIn, isLoaded} = useAuth();
    const [email, setEmail] = useState("");
    const inputRef=useRef<TextInput>(null);

    return (
        <SafeAreaView className="flex-1 bg-background px-6 pt-4">
            <Text className="text-2xl font-bold text-foreground">Sign In with Email</Text>
            {/* Email / Password or Magic Link form components */}
            <TextInput
                className="mt-1 text-sm text-muted-foreground"
                ref={inputRef}
                placeholder={"Email"}
                onChangeText={value => console.log(value)}
            />
            <TextInput
                className="mt-1 text-sm text-muted-foreground"
                placeholder={"Password"}
                onChangeText={value => console.log(value)}
            />
            <Pressable
                className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-80 ${
                    isLoaded ? "opacity-60" : ""
                }`}
                onPress={() => inputRef.current?.clear()}>
                <Text className="text-primary-foreground/80
                dark:text-foreground/75">Login</Text>
            </Pressable>
            <Text  className="text-primary-foreground/80
                dark:text-foreground/75">
                You don't have an account?
                <Link href={"/(auth)/sign-up"}>
                    <Text  className="font-bold text-primary-foreground/80
                dark:text-foreground/75"> Sign up here!</Text>
                </Link>
            </Text>

        </SafeAreaView>
    );
}