import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
    const ranges = [
        { key: 'week', label: 'Últimos 7 días' },
        { key: 'month', label: 'Últimos 30 días' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Rango de tiempo:</Text>
            <View style={styles.buttonsContainer}>
                {ranges.map((range) => (
                    <Pressable
                        key={range.key}
                        style={[
                            styles.button,
                            selectedRange === range.key && styles.buttonActive
                        ]}
                        onPress={() => onRangeChange(range.key)}
                    >
                        <Text style={[
                            styles.buttonText,
                            selectedRange === range.key && styles.buttonTextActive
                        ]}>
                            {range.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 8,
        fontWeight: '500',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    buttonActive: {
        backgroundColor: '#7ED321',
        borderColor: '#7ED321',
    },
    buttonText: {
        fontSize: 14,
        color: '#CCCCCC',
        textAlign: 'center',
        fontWeight: '500',
    },
    buttonTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default TimeRangeSelector;
