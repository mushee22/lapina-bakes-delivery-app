
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import InputBox from "./input-box";
import Typography from "./Typography";

interface ModalSelectProps<T> {
    data: T[];
    labelField: keyof T;
    valueField: keyof T;
    value?: string | number | null;
    onChange: (item: T) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
}

const ModalSelect = <T extends object>({
    data,
    labelField,
    valueField,
    value,
    onChange,
    placeholder = "Select item",
    searchPlaceholder = "Search...",
    disabled = false,
}: ModalSelectProps<T>) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedItem = data.find((item) => item[valueField] === value);

    const filteredData = data.filter((item) => {
        const label = String(item[labelField]).toLowerCase();
        return label.includes(searchQuery.toLowerCase());
    });

    const handleSelect = (item: T) => {
        onChange(item);
        setModalVisible(false);
        setSearchQuery("");
    };

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => !disabled && setModalVisible(true)}
                className={cn(
                    "flex flex-row items-center rounded-2xl h-16 px-5 border-2 bg-white/90 w-full",
                    modalVisible ? "border-orange-400 shadow-lg shadow-orange-200" : "border-gray-200 shadow-md shadow-gray-100"
                )}
            >
                <Text
                    className={cn(
                        "flex-1 text-base font-medium",
                        selectedItem ? "text-gray-900" : "text-gray-400"
                    )}
                >
                    {selectedItem ? String(selectedItem[labelField]) : placeholder}
                </Text>
                <ChevronDown size={20} color={selectedItem ? "#FB923C" : "black"} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-secondary rounded-t-3xl h-[80%] w-full p-4 flex gap-y-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Typography.Base className="font-bold text-xl">
                                {placeholder}
                            </Typography.Base>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSearchQuery("");
                                }}
                                className="p-2 bg-orange-50 rounded-full"
                            >
                                <X size={20} color="#3B2F2F" />
                            </TouchableOpacity>
                        </View>

                        <InputBox
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            startIcon={<Search size={20} color="#3B2F2F" />}
                        />

                        <FlatList
                            data={filteredData}
                            keyExtractor={(item, index) => String(item[valueField]) || String(index)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    className={cn(
                                        "py-4 border-b border-gray-100 flex-row justify-between items-center",
                                        String(item[valueField]) === String(value) && "bg-orange-50 px-2 rounded-lg border-b-0"
                                    )}
                                >
                                    <Typography.Base className={cn(
                                        "text-gray-800",
                                        String(item[valueField]) === String(value) && "font-semibold "
                                    )}>
                                        {String(item[labelField])}
                                    </Typography.Base>
                                    {String(item[valueField]) === String(value) && (
                                        <Check size={20} color="#3B2F2F" />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <View className="py-8 items-center">
                                    <Typography.Base className="text-gray-400">
                                        No items found
                                    </Typography.Base>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default ModalSelect;
