import { StackHeader } from "@/components/elements/stack-header";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="order"
          options={{ title: "Order", headerShown: false }}
        />
        <Stack.Screen
          name="transactions"
          options={{
            title: "Transactions",
            headerShown: true,
            header: () => (
              <StackHeader
                title="Transactions"
                isAddTranscation={false}
                isScannIcon={false}
                isBackButtonVisible={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            title: "Add New Transaction",
            headerShown: true,
            header: () => (
              <StackHeader
                title="Add New Transaction"
                isCart={false}
                isScannIcon={false}
                isBackButtonVisible={true}
                isAddTranscation={false}
              />
            ),
          }}
        />
        <Stack.Screen
          name="scanner"
          options={{
            title: "Order",
            headerShown: true,
            header: () => (
              <StackHeader
                title="Payment Scanner"
                isCart={false}
                isScannIcon={false}
                isBackButtonVisible={true}
                isAddTranscation={false}
              />
            ),
          }}
        />
      </Stack>
    </>
  );
}
