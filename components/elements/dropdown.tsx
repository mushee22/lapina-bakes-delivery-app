import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps<T> {
    data: T[];
    labelField: keyof T;
    valueField: keyof T;
    placeholder?: string;
    searchPlaceholder?: string;
    value?: string | number | null;
    onChange: (item: T) => void;
}

const DropdownComponent = <T extends object>({
    data,
    labelField,
    valueField,
    placeholder = "Select item",
    searchPlaceholder = "Search...",
    value,
    onChange,
}: DropdownComponentProps<T>) => {

    const renderItem = (item: T) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{String(item[labelField])}</Text>
                {item[valueField] === value && (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="down"
                        size={20}
                    />
                )}
            </View>
        );
    };

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField={labelField as string}
            valueField={valueField as string}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            value={value}
            onChange={onChange}
            renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="black" name="safety" size={20} />
            )}
            renderItem={renderItem}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});