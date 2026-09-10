import { useClerk, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";

export type SignUpFormValues = {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
};

export const useSignUpEmail = () => {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { client } = useClerk();
    const router = useRouter();

    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const isLoading = fetchStatus === "fetching";

    const handleSignUp = async ({
        firstName,
        lastName,
        emailAddress,
        password,
    }: SignUpFormValues) => {
        setError("");

        const trimmedEmail = emailAddress.trim();
        if (!trimmedEmail || !password) {
            setError("Email and password are required.");
            return;
        }

        const { error: signUpError } = await signUp.password({
            emailAddress: trimmedEmail,
            password,
            firstName: firstName.trim() || undefined,
            lastName: lastName.trim() || undefined,
        });

        if (signUpError) {
            setError(signUpError.longMessage || signUpError.message);
            return;
        }

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
            setError(sendError.longMessage || sendError.message);
            return;
        }

        setPendingVerification(true);
    };

    const handleVerify = async () => {
        setError("");

        if (!code.trim()) {
            setError("Enter the verification code from your email.");
            return;
        }

        const { error: verifyError } = await signUp.verifications.verifyEmailCode({
            code: code.trim(),
        });

        if (verifyError) {
            setError(verifyError.longMessage || verifyError.message);
            return;
        }

        // Account is created. Clerk also creates a client session at this point;
        // without removing it, the next sign-in returns "You're already signed in".
        // Do not call finalize() — that would activate the session and open the app.
        if (signUp.status === "complete") {
            await client.removeSessions();
            await signUp.reset();
            router.replace("/(auth)/email-sign-in");
            return;
        }

        setError("Verification incomplete. Please try again.");
    };

    const handleResendCode = async () => {
        setError("");
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
            setError(sendError.longMessage || sendError.message);
        }
    };

    return {
        pendingVerification,
        code,
        setCode,
        error,
        errors,
        isLoading,
        handleSignUp,
        handleVerify,
        handleResendCode,
    };
};

export default useSignUpEmail;
