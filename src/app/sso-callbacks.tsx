import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

const SSOCallbackScreen = () => {
    const { userId, isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        console.log(userId);
        return <Redirect href={"/(tabs)"} />;
    }

    return <Redirect href={"/(auth)/sign-in"} />;
};

export default SSOCallbackScreen;