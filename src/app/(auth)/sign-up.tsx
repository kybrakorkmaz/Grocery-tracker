import { useSignUpEmail } from "@/features/auth/hooks/useSignUpEmail";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
    const {
        pendingVerification,
        code,
        setCode,
        error,
        errors,
        isLoading,
        handleSignUp,
        handleVerify,
        handleResendCode,
    } = useSignUpEmail();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const fieldError =
        errors?.fields?.emailAddress?.message ||
        errors?.fields?.password?.message ||
        errors?.fields?.firstName?.message ||
        errors?.fields?.lastName?.message ||
        errors?.fields?.code?.message;

    const displayError = error || fieldError;

    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
            <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
            <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

            <View className="px-6 pt-4">
                <Text className="text-center font-mono text-4xl font-extrabold uppercase tracking-tight text-primary-foreground dark:text-foreground">
                    Grocify
                </Text>
                <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
                    {pendingVerification ? "Confirm your email to finish." : "Create your account."}
                </Text>
            </View>

            <KeyboardAwareScrollView
                className="mt-8 flex-1 rounded-t-[36px] bg-card"
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
                keyboardShouldPersistTaps="handled"
                bottomOffset={24}
            >
                <View className="self-center rounded-full bg-secondary px-3 py-1">
                    <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
                        {pendingVerification ? "Verify Email" : "Sign Up"}
                    </Text>
                </View>

                {pendingVerification ? (
                    <>
                        <Text className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                            We sent a verification code to your email. Enter it below, then sign in.
                        </Text>

                        <Text className="mt-6 text-sm font-semibold text-foreground">Verification code</Text>
                        <View className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3">
                            <TextInput
                                value={code}
                                onChangeText={setCode}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor="#8aa397"
                                keyboardType="number-pad"
                                autoComplete="one-time-code"
                                className="text-base text-foreground"
                            />
                        </View>

                        {displayError ? (
                            <Text className="mt-3 text-sm text-destructive-foreground">{displayError}</Text>
                        ) : null}

                        <Pressable
                            className={`mt-6 h-14 items-center justify-center rounded-2xl bg-primary active:opacity-80 ${
                                isLoading ? "opacity-60" : ""
                            }`}
                            disabled={isLoading}
                            onPress={handleVerify}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-base font-semibold text-primary-foreground">
                                    Verify & continue
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            className="mt-3 h-12 items-center justify-center active:opacity-70"
                            disabled={isLoading}
                            onPress={handleResendCode}
                        >
                            <Text className="text-sm font-semibold text-foreground">Resend code</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                            Sign up with email. You will verify your address before signing in.
                        </Text>

                        <Text className="mt-6 text-sm font-semibold text-foreground">First name</Text>
                        <View className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3">
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First name"
                                placeholderTextColor="#8aa397"
                                autoComplete="given-name"
                                className="text-base text-foreground"
                            />
                        </View>

                        <Text className="mt-4 text-sm font-semibold text-foreground">Last name</Text>
                        <View className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3">
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last name"
                                placeholderTextColor="#8aa397"
                                autoComplete="family-name"
                                className="text-base text-foreground"
                            />
                        </View>

                        <Text className="mt-4 text-sm font-semibold text-foreground">Email</Text>
                        <View className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3">
                            <TextInput
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                placeholder="you@example.com"
                                placeholderTextColor="#8aa397"
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                className="text-base text-foreground"
                            />
                        </View>

                        <Text className="mt-4 text-sm font-semibold text-foreground">Password</Text>
                        <View className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Create a password"
                                placeholderTextColor="#8aa397"
                                secureTextEntry
                                autoComplete="new-password"
                                className="text-base text-foreground"
                            />
                        </View>

                        {displayError ? (
                            <Text className="mt-3 text-sm text-destructive-foreground">{displayError}</Text>
                        ) : null}

                        <Pressable
                            className={`mt-6 h-14 items-center justify-center rounded-2xl bg-primary active:opacity-80 ${
                                isLoading ? "opacity-60" : ""
                            }`}
                            disabled={isLoading}
                            onPress={() =>
                                handleSignUp({
                                    firstName,
                                    lastName,
                                    emailAddress,
                                    password,
                                })
                            }
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-base font-semibold text-primary-foreground">
                                    Sign up
                                </Text>
                            )}
                        </Pressable>

                        {/* Required for Clerk CAPTCHA on web */}
                        <View nativeID="clerk-captcha" />

                        <Text className="mt-5 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/(auth)/email-sign-in">
                                <Text className="font-bold text-foreground">Sign in</Text>
                            </Link>
                        </Text>
                    </>
                )}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
