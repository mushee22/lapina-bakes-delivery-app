import CustomError from "@/lib/error";
import { commonService } from "@/service/common";
import { transactionService } from "@/service/transaction";
import { Store } from "@/type/store";
import { TransactionAddInput } from "@/type/transaction";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Button, InputBox, ModalSelect, Typography } from "../elements";

interface FormValues {
  store_id: string | null;
  amount?: number;
  payment_mode: string;
  payment_note?: string;
  location_id?: string;
  payment_discount?: number;
  transaction_date?: string;
}

export default function AddTransactionDialog() {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();

  const { data: stores, isLoading: isStoreLoading } = useQuery({
    queryKey: ["delivery-boy-stores"],
    queryFn: () => commonService.getDeliveryStores()
  });



  const handleClose = () => {
    router.back();
    reset()
  };


  const transactionMutation = useMutation({
    mutationFn: (data: FormValues) =>
      transactionService.addNewTransactions(data),
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Payment Added",
        text2: "New payment added to the order",
      });
      handleClose()
    },
    onError: (error: CustomError) => {
      Toast.show({
        type: "error",
        text1: `${error.message}`,
        text2: "Somthing went wrong",
      });
    },
  });

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid, dirtyFields, isDirty, validatingFields },
  } = useForm<TransactionAddInput>({
    defaultValues: {
      amount: 0,
      payment_discount: 0.0,
      payment_mode: "cash",
      payment_note: "",
      store_id: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('eroor', dirtyFields, isDirty, validatingFields)
    if (isValid) {
      console.log(data)
      await transactionMutation.mutateAsync(data);
    } else {
      Toast.show({
        type: "error",
        text1: "Payment Add Filed",
        text2: "Somthing went wrong",
      });
    }
  };

  return (
    <>
      <KeyboardAvoidingView className="flex-1 pt-5 pb-3">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          className="flex w-full px-4 rounded-3xl ">
          <View className="flex-1 ">
            <View>
              <Typography.Base className="font-bold text-xl">New Transaction</Typography.Base>
              <Typography.Sm className="font-bold text-gray-500">Add new store transaction</Typography.Sm>
            </View>
            <View className="gap-y-4 mb-3 flex-1 pt-2">


              <View className="gap-y-1">
                <Typography.Base>Store</Typography.Base>
                <Controller
                  control={control}
                  name="store_id"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <ModalSelect
                        data={stores ?? []}
                        labelField="name"
                        valueField="id"
                        value={value}
                        onChange={(item: Store) => onChange(item.id)}
                        placeholder="Select Store"
                        searchPlaceholder="Search Store..."
                      />
                      {error && <Typography.Base className="text-red-500">{error.message}</Typography.Base>}
                    </>
                  )}
                />
              </View>
              <View className="gap-y-1">
                <Typography.Base>Amount</Typography.Base>
                <Controller
                  control={control}
                  name="amount"
                  rules={{
                    required: true,
                    // max: transactionMaxAmount,
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <InputBox
                        placeholder="Enter the amount"
                        keyboardType="numeric"
                        value={value?.toString()}
                        onChangeText={onChange}
                      />
                      {error && <Typography.Base className="text-red-500">{error.message}</Typography.Base>}
                    </>
                  )}
                />
              </View>
              <View className="gap-y-1">
                <Typography.Base>Cash Discount</Typography.Base>
                <Controller
                  control={control}
                  name="payment_discount"
                  rules={{
                    required: false,
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <InputBox
                        placeholder="Enter discount amount"
                        keyboardType="numeric"
                        value={value?.toString()}
                        onChangeText={onChange}
                      />
                      {error && <Typography.Base className="text-red-500">{error.message}</Typography.Base>}
                    </>
                  )}
                />
              </View>
              <View className="gap-y-1">
                <Typography.Base>Payment Mode</Typography.Base>
                <Controller
                  control={control}
                  name="payment_mode"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <View className="flex-row flex-wrap gap-2">
                        {
                          paymentModes.map((mode) => (
                            <TouchableOpacity
                              key={mode.value}
                              activeOpacity={0.7}
                              className={`items-center justify-center rounded-2xl min-w-[80px] ${value === mode.value ? "bg-primary text-white" : "bg-white border-green-50"}`}
                              style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderWidth: 1,
                                borderColor: "#E5E7EB",
                              }}
                              onPress={() => {
                                setValue("payment_mode", mode.value);
                              }}
                            >
                              <Typography.Sm
                                className={`font-semibold text-center ${value === mode.value ? "text-white" : "text-gray-700"}`}
                              >
                                {mode.label}
                              </Typography.Sm>
                            </TouchableOpacity>
                          ))
                        }
                      </View>
                      {error && <Typography.Base className="text-red-500">{error.message}</Typography.Base>}
                    </>
                  )}
                />
              </View>
              <View className="gap-y-1">
                <Typography.Base>Comment</Typography.Base>
                <Controller
                  control={control}
                  name="payment_note"
                  render={({ field: { onChange, value }, fieldState: { error, } }) => (
                    <>
                      <InputBox
                        placeholder="Enter comment"
                        multiline={true}
                        containerClassName="h-auto"
                        className="min-h-[100px] pt-3 align-top"
                        value={value}
                        onChangeText={onChange}
                      />
                      {error && <Typography.Base className="text-red-500">{error.message}</Typography.Base>}
                    </>
                  )}
                />
              </View>
            </View>
          </View>
          <View className="flex-row gap-x-2 px-4">
            <Button
              className="bg-primary flex-1"
              onPress={handleSubmit(onSubmit)}
              isLoading={transactionMutation.isPending}
            >
              <Typography.Base className="text-white">Add</Typography.Base>
            </Button>
            <Button className="flex-1" onPress={handleClose}>
              <Typography.Base className="text-primary">Cancel</Typography.Base>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const paymentModes = [
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Online",
    value: "online",
  },
];
