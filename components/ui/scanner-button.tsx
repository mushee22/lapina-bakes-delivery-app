import { useRouter } from "expo-router";
import { ScanEyeIcon } from "lucide-react-native";
import { Pressable } from "react-native";

export default function ScannerButton() {
  const router = useRouter()  
  return (
    <Pressable onPress={() => router.push('/delivery/scanner')}>
        <ScanEyeIcon color="#ffff" />
    </Pressable>
  );
}
