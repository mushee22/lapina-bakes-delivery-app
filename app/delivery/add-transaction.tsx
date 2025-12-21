import { ScreenWrapper } from "@/components/elements";
import AddTransactionDialog from "@/components/ui/add-transaction-dialog";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";

export default function AddTransaction() {
    return (
        <>
            <ScreenWrapper edges={[]}>
                <KeyboardAwareScrollView
                    contentContainerClassName="bg-secondary"
                    bottomOffset={62}
                >
                    <AddTransactionDialog />
                </KeyboardAwareScrollView>
            </ScreenWrapper>
            <KeyboardToolbar />
        </>
    );
}