import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TextInput} from "react-native";
export default function SignUpScreen(){
    return(
        <SafeAreaView className="flex-1 bg-background px-6 pt-4">
            <Text
            className="text-primary-foreground/80 dark:text-foreground/75">
                Sign up
            </Text>
            <TextInput
                className="mt-1 text-sm text-muted-foreground"
                placeholder={"Email"}
                onChangeText={value => console.log(value)}
            />
            <TextInput
                className="mt-1 text-sm text-muted-foreground"
                placeholder={"Password"}
                onChangeText={value => console.log(value)}
            />
        </SafeAreaView>
    )
}