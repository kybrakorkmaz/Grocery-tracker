import { useUser } from "@clerk/expo";
import {Text} from "react-native";
export default function ProfileHeader() {
    const { user } = useUser();

    console.log("User ID:", user?.id);
    console.log("Email:", user?.primaryEmailAddress?.emailAddress);

    return <Text>{user?.fullName}</Text>;
}