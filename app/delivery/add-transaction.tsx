import AddTransactionDialog from "@/components/ui/add-transaction-dialog";
import { View } from "react-native";

export default function AddTransaction() {
    return (
        <View className="relative flex-1 pb-7">
            <AddTransactionDialog />
        </View>
    );
}