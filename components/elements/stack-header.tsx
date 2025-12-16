import { usePlatform } from "@/hooks/use-platform";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import ScannerButton from "../ui/scanner-button";
import Typography from "./Typography";

export function StackHeader({
  title,
  isCart = true,
  isScannIcon = true,
  isAddTranscation = true,
  isBackButtonVisible = true,
}: {
  title: string;
  isCart?: boolean;
  isScannIcon?: boolean,
  isAddTranscation?: boolean,
  isBackButtonVisible?: boolean;
}) {
  const { isIOS } = usePlatform();

  return (
    <View
      className={cn(
        "flex-row items-end  gap-x-3 bg-primary justify-center  py-4",
        isIOS ? "h-[90px] px-5" : "h-[80px] px-3"
      )}
    >
      {isBackButtonVisible && <BackButton label="Back" />}
      <View className="flex-1 items-center">
        <Typography.Lg className="font-bold text-white">{title}</Typography.Lg>
      </View>
      <View className="absolute right-3 bottom-4 flex-row gap-x-2">
        {isScannIcon ? (
          <View className="">
            <ScannerButton />
          </View>
        ) : (
          <></>
        )}
        {isAddTranscation ? (
          <Link href="/delivery/add-transaction">
            <Plus color="#fff" />
          </Link>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

export function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  const handlePress = () => {
    router.back();
  };
  return (
    <TouchableOpacity
      className="flex-row rounded-full absolute left-0 bottom-4 items-end"
      onPress={handlePress}
    >
      <ChevronLeft color="#fff" />
      <Typography.Lg className="font-bold text-white">
        {label ?? ""}
      </Typography.Lg>
    </TouchableOpacity>
  );
}
