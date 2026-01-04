import LocationFilter from "@/components/section/location-filter";
import OrderCard from "@/components/ui/order-card";
import OrderStatusBadge from "@/components/ui/order-status";
import useRefresh from "@/hooks/use-refresh";
import { commonService } from "@/service/common";
import { orderService } from "@/service/order";
import { OrderStatus } from "@/type/order";
import {
  DateTimePickerEvent
} from "@react-native-community/datetimepicker";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ListFilter } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View
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

  const router = useRouter()

  const { isRefreshing, onRefresh } = useRefresh(["delivery-boy-orders"]);

  const { data: infiniteOrders, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: [
      "delivery-boy-orders",
      query.location,
      query.status,
      query.page,
      query.date,
    ],
    queryFn: ({ pageParam = 1 }) =>
      orderService.getDeliveryBoyOrders(
        query.location,
        query.status,
        query.date,
        pageParam
      ),
    initialPageParam: 1,
    getNextPageParam: (data) => {
      if (data.meta && data.meta.last_page > data.meta.current_page) {
        return data.meta.current_page + 1
      }
      return undefined
    },
  });

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ["delivery-boy-locations"],
    queryFn: () => commonService.getLocations(),
  });



  const handleOnSelectCategory = (location: string) => {
    setQuery({
      ...query,
      location,
    });
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
      </View>

      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center mt-6">
            <ActivityIndicator color="#C85A2B" />
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
            }
            data={infiniteOrders?.pages?.map((page) => page.orders).flat() || []}
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
            scrollEnabled={true}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
          />
        )}
      </View>
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
