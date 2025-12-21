import { ScreenWrapper, Typography } from "@/components/elements";
import { CURRENCY } from "@/constants";
import { themeConfig } from "@/constants/theme-config";
import { transactionService } from "@/service/transaction";
import { Transactions } from "@/type/transaction";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "expo-router";
import { Calendar, Clock, Plus, Store } from "lucide-react-native";
import { FlatList, RefreshControl, View } from "react-native";

export default function TransactionsListPage() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["delivery-boy-transactions"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await transactionService.getAllTransactions(pageParam);
            return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const meta = lastPage.meta;
            if (meta && meta.current_page < meta.last_page) {
                return meta.current_page + 1;
            }
            return undefined;
        },
    });

    const transactions = data?.pages.flatMap((page) => page.data) || [];

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <ScreenWrapper edges={[]} className="">
            <Link href={"/delivery/add-transaction"}
                className="absolute top-4 z-40 right-4 rounded-full">
                <View className="w-10 h-10 items-center justify-center bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </View>
            </Link>
            <View className="mb-4">
                <Typography.Lg className="font-bold text-gray-800">
                    Transactions
                </Typography.Lg>
                <Typography.Sm className="text-gray-600 mt-1">
                    Transactions history
                </Typography.Sm>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TransactionCard transaction={item} />}
                contentContainerStyle={{ gap: 12 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <Typography.Base className="text-center text-gray-400">Loading more...</Typography.Base>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <Typography.Base className="text-gray-400">No transactions found</Typography.Base>
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center py-20">
                            <Typography.Base className="text-gray-400">Loading...</Typography.Base>
                        </View>
                    )
                }
            />
        </ScreenWrapper>
    );
}



function TransactionCard({ transaction }: { transaction: Transactions }) {
    const formattedDate = transaction.transaction_date ? format(new Date(transaction.transaction_date), "dd MMM yyyy") : format(new Date(transaction.created_at), "dd MMM yyyy");
    const formattedTime = transaction.transaction_date ? format(new Date(transaction.transaction_date), "hh:mm a") : format(new Date(transaction.created_at), "hh:mm a");

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100 mb-3">

            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                        <Store size={20} color={themeConfig.colors.brand} />
                    </View>
                    <View className="flex-1">
                        <Typography.Base className="font-bold text-gray-800" numberOfLines={1}>
                            {transaction.store?.name || "Unknown Store"}
                        </Typography.Base>
                        <View className="flex-row items-center mt-1">
                            <Calendar size={12} color="#666" />
                            <Typography.Sm className="text-gray-500 ml-1 mr-2">
                                {formattedDate}
                            </Typography.Sm>
                            <Clock size={12} color="#666" />
                            <Typography.Sm className="text-gray-500 ml-1">
                                {formattedTime}
                            </Typography.Sm>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Typography.Lg className="font-bold text-primary">
                        {CURRENCY}{transaction.amount}
                    </Typography.Lg>
                </View>
            </View>


            {(transaction.payment_note || (transaction.payment_discount && transaction.payment_discount > 0)) ? (
                <View className="bg-gray-50 p-2 rounded-lg mb-3">
                    {transaction.payment_discount && transaction.payment_discount > 0 ? (
                        <View className="flex-row items-center justify-between mb-1">
                            <Typography.Sm className="text-gray-500">Discount:</Typography.Sm>
                            <Typography.Sm className="font-medium text-gray-800">
                                {CURRENCY}{transaction.payment_discount}
                            </Typography.Sm>
                        </View>
                    ) : null}
                    {transaction.payment_note ? (
                        <View>

                            <Typography.Sm className="text-gray-700 italic">
                                {transaction.payment_note}
                            </Typography.Sm>
                        </View>
                    ) : null}
                </View>
            )
                : null
            }


            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    {
                        transaction.payment_mode ?
                            <Typography.Sm className="text-gray-500 uppercase font-medium mr-2">
                                {transaction.payment_mode}
                            </Typography.Sm>
                            :
                            null
                    }
                </View>
            </View>
        </View>
    )
}