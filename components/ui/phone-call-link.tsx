import { makeAPhoneCall } from "@/lib/helper";
import { Phone } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Typography } from "../elements";

export default function PhoneCallLink({ phone = "" }: { phone: string }) {

  const handleMakePhoneCall = async() => {
    makeAPhoneCall(phone)
  };   

  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={handleMakePhoneCall}
    >
      <Phone size={12} color="#C85A2B" />
      <Typography.Sm className="text-gray-600 ml-1">
        {phone}
      </Typography.Sm>
    </TouchableOpacity>
  );
}