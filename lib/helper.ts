import { FieldErrors, FieldValues } from "react-hook-form";
import { Alert, Linking } from "react-native";

export const extractErrorMessages = <T extends FieldValues>(errors: FieldErrors<T>) => {
  return Object.values(errors).map((error) => error?.message || "").join("\n");
};

export const makeAPhoneCall = async(phone: string) => {
    try {
      const supported = await Linking.canOpenURL(`tel:${phone}`);
      if (!supported) {
        Alert.alert("Phone number is not supported");
        return;
      }
      Linking.openURL(`tel:${phone}`);
    } catch (error) {
      console.error("Error opening phone app:", error);
    }
  };