import Dialog from "@/components/elements/modal";
import LocationFilter from "@/components/section/location-filter";
import OrderCard from "@/components/ui/order-card";
import OrderStatusBadge from "@/components/ui/order-status";
import useRefresh from "@/hooks/use-refresh";
import { commonService } from "@/service/common";
import { orderService } from "@/service/order";
import { OrderStatus } from "@/type/order";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ListFilter, X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ScreenWrapper, Typography } from "../../elements";

const defaultDate = new Date();

export default function DeliveryBoyHomeScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

  const [query, setQuery] = useState<{
    location: string;
    status: string;
    page: number;
    date?: Date;
  }>({
    location: "",
    status: "",
    page: 1,
    date: undefined,
  });

  const { isRefreshing, onRefresh } = useRefresh(["delivery-boy-orders"]);

  const { data: { orders = [], meta } = {}, isLoading } = useQuery({
    queryKey: [
      "delivery-boy-orders",
      query.location,
      query.status,
      query.page,
      query.date,
    ],
    queryFn: () =>
      orderService.getDeliveryBoyOrders(
        query.location,
        query.status,
        query.date,
        query.page
      ),
  });

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ["delivery-boy-locations"],
    queryFn: () => commonService.getLocations(),
  });

  const handleLoadMore = () => {
    if ((meta?.last_page || 0) > query.page) {
      setQuery({
        ...query,
        page: query.page + 1,
      });
    }
  };

  const handleOnSelectCategory = (location: string) => {
    setQuery({
      ...query,
      location,
      page: 1,
    });
  };

  const handleClickOnDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: query.date ?? defaultDate,
        onChange: onChange,
        mode: "date",
      });
      return;
    }
    setShowDatePicker(true);
  };

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    setTempDate(date)
  };

  const { formatedDate, year } = useMemo(() => {
    const currentdate = tempDate ?? defaultDate;
    const formatedDate = currentdate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const year = currentdate.getFullYear();
    return {
      formatedDate,
      year,
    };
  }, [query.date]);

  const RenderRightIcon = useCallback(
    ({ status }: { status?: OrderStatus }) => {
      return (
        <View className="flex-row items-center gap-x-1">
          <ListFilter color="black" size={20} />
          {status ? (
            <OrderStatusBadge status={status} />
          ) : (
            <Typography.Base weight="bold" className="text-gray-600 ml-1">
              Filter by Status
            </Typography.Base>
          )}
        </View>
      );
    },
    []
  );

  return (
    <ScreenWrapper edges={[]}>
      <View className="mb-4">
        <Typography.Lg className="font-bold text-gray-800">
          Your Orders to Deliver
        </Typography.Lg>
        <Typography.Sm className="text-gray-600 mt-1">
          Track and manage your bakery orders to be delivered
        </Typography.Sm>
      </View>
      <View className="mb-4">
        <Typography.Base className="font-semibold text-gray-800 mb-3">
          Locations
        </Typography.Base>
        {isLoadingLocations ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#C85A2B" />
          </View>
        ) : (
          <LocationFilter
            locations={locations}
            onSelectLocation={handleOnSelectCategory}
            selectedLocation={query.location ?? ""}
          />
        )}
      </View>
      <View className="mb-2 flex-row justify-between items-center gap-x-1">
        <Dropdown
          data={orderStatus}
          valueField="value"
          labelField="label"
          value={query.status}
          onChange={(item) => {
            setQuery({
              ...query,
              status: item.value ?? null,
              page: 1,
            });
          }}
          mode="modal"
          style={{
            minWidth: 24,
            height: 28,
          }}
          containerStyle={{
            width: 320,
          }}
          iconStyle={{
            display: "none",
          }}
          selectedTextStyle={{
            display: "none",
          }}
          placeholder="Filter By Status"
          placeholderStyle={{}}
          renderRightIcon={() => (
            <RenderRightIcon status={query.status as OrderStatus} />
          )}
        />
        <View className="flex-row gap-x-1">
          {query.date ? (
            <View className="bg-gray-200 px-2 py-0.5 rounded-md flex-row gap-x-0.5 items-center">
              <Typography.Sm>{query?.date?.toLocaleDateString()}</Typography.Sm>
              <TouchableOpacity
                className="ml-1 p-0.5 bg-white rounded-full"
                onPress={() => setQuery({ ...query, date: undefined })}
              >
                <X size={13} />
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            className="flex-row gap-x-1 items-center"
            onPress={handleClickOnDatePicker}
          >
            <Calendar size={20} />
            {showDatePicker ? (
              <Dialog visible={true}>
                <View className="bg-white rounded-2xl overflow-hidden relative">
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white"
                  >
                    <X size={20} />
                  </TouchableOpacity>
                  <View className=" bg-blue-600 pl-4 pt-3 pb-2 gap-y-1">
                    <Typography.Base className="text-white text-lg font-bold">
                      {year}
                    </Typography.Base>
                    <Typography.Base className="text-white text-5xl">
                      {formatedDate}
                    </Typography.Base>
                  </View>
                  <View>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={query.date ?? defaultDate}
                      onChange={onChange}
                      display="inline"
  
                    />
                  </View>
                  <View className="flex-row px-4 pb-3 gap-x-8 justify-end">
                    <TouchableOpacity className=""
                    onPress={() => {
                      setShowDatePicker(false)
                    }}
                    >
                      <Typography.Lg className="text-blue-400 uppercase text-xl">Cancel</Typography.Lg>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false)
                      setQuery({
                        ...query,
                        date: tempDate
                      })
                    }}
                    >
                      <Typography.Lg className="text-blue-400 uppercase text-xl">OK</Typography.Lg>
                    </TouchableOpacity>
                  </View>
                </View>
              </Dialog>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center mt-6">
              <ActivityIndicator color="#C85A2B" />
            </View>
          ) : (
            <FlatList
              data={orders}
              ItemSeparatorComponent={() => <View className="h-1" />}
              contentContainerClassName="pb-6"
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center mt-6">
                  <Typography.Lg className="text-gray-400">
                    No orders found
                  </Typography.Lg>
                </View>
              )}
              renderItem={({ item: order }) => (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  orderId={order.order_number}
                  date={order.created_at}
                  total={order.total_amount}
                  itemCount={order.order_items?.length}
                  status={order.status}
                  items={order.order_items}
                  detailViewPathGroup="delivery"
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              onEndReached={() => {
                if ((meta?.last_page || 0) > query.page) {
                  handleLoadMore();
                }
              }}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const orderStatus = [
  {
    value: "",
    label: "All",
  },
  {
    label: "Out of delivery",
    value: "out_of_delivery",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];
