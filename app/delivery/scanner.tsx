import { ScreenWrapper, Typography } from "@/components/elements";
import useSettings from "@/hooks/use-settings";
import { Image, View } from "react-native";

export default function PaymentScanner() {
  const { payment_scanner } = useSettings();
  return (
    <ScreenWrapper edges={[]} className="pt-0 ">
      <View className="flex-1 items-center justify-center gap-y-3">
        {payment_scanner ? (
          <Image source={{ uri: payment_scanner }} width={250} height={250} />
        ) : null}
        <Typography.Lg>QR Scanner To Make Payment</Typography.Lg>
      </View>
    </ScreenWrapper>
  );
}
