import { useClerk, useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";

export type SignInFormValues = {
    emailAddress: string;
    password: string;
};

const isSessionExistsError = (error: { code?: string } | null | undefined) =>
    error?.code === "session_exists";

export const useAuthenticate = () => {
    const { signIn, errors, fetchStatus } = useSignIn();
    const { client } = useClerk();
    const router = useRouter();

    const [needsTrustCode, setNeedsTrustCode] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const isLoading = fetchStatus === "fetching";

    const finalizeSignIn = async () => {
        const { error: finalizeError } = await signIn.finalize({
            navigate: () => {
                router.replace("/(tabs)");
            },
        });

        if (finalizeError) {
            setError(finalizeError.longMessage || finalizeError.message);
        }
    };

    const attemptPasswordSignIn = async (emailAddress: string, password: string) => {
        const { error: signInError } = await signIn.password({
            emailAddress,
            password,
        });

        if (signInError) {
            return { error: signInError };
        }

        if (signIn.status === "complete") {
            await finalizeSignIn();
            return { error: null };
        }

        if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors?.find(
                (factor) => factor.strategy === "email_code"
            );

            if (emailCodeFactor) {
                const { error: sendError } = await signIn.mfa.sendEmailCode();
                if (sendError) {
                    return { error: sendError };
                }
                setNeedsTrustCode(true);
                return { error: null };
            }
        }

        return {
            error: {
                code: "incomplete",
                message: "Sign-in could not be completed. Please try again.",
                longMessage: "Sign-in could not be completed. Please try again.",
            },
        };
    };

    const handleSignIn = async ({ emailAddress, password }: SignInFormValues) => {
        setError("");

        const trimmedEmail = emailAddress.trim();
        if (!trimmedEmail || !password) {
            setError("Email and password are required.");
            return;
        }

        let result = await attemptPasswordSignIn(trimmedEmail, password);

        // Leftover client session from sign-up (without finalize) triggers this.
        if (isSessionExistsError(result.error)) {
            await client.removeSessions();
            result = await attemptPasswordSignIn(trimmedEmail, password);
        }

        if (result.error) {
            setError(result.error.longMessage || result.error.message);
        }
    };

    const handleVerifyTrustCode = async () => {
        setError("");

        if (!code.trim()) {
            setError("Enter the verification code from your email.");
            return;
        }

        const { error: verifyError } = await signIn.mfa.verifyEmailCode({
            code: code.trim(),
        });

        if (verifyError) {
            setError(verifyError.longMessage || verifyError.message);
            return;
        }

        if (signIn.status === "complete") {
            await finalizeSignIn();
            return;
        }

        setError("Verification incomplete. Please try again.");
    };

    return {
        needsTrustCode,
        code,
        setCode,
        error,
        errors,
        isLoading,
        handleSignIn,
        handleVerifyTrustCode,
    };
};

export default useAuthenticate;
