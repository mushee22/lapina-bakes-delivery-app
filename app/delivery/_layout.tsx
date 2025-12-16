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
                isAddTranscation={true}
                isScannIcon={false}
                isBackButtonVisible={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={
            {
              title: "Add Transaction",
              headerShown: true,
              headerStyle: {
                backgroundColor: "#FFF8F1",
              },
              presentation: "formSheet",
              sheetAllowedDetents: [0.85],
              contentStyle: {
                backgroundColor: "#FFF8F1",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                height: '100%'
              },
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
                isAddTranscation={true}
              />
            ),
          }}
        />
      </Stack>
    </>
  );
}
