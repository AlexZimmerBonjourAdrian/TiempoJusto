import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

const TabButton = memo(({ 
    label, 
    legend, 
    isActive, 
    onPress, 
    isRunning 
}) => {
    return (
        <Pressable onPress={onPress} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
            <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                {label}
            </Text>
            <Text style={[styles.tabButtonLegend, isActive && styles.tabButtonLegendActive]}>
                {legend}
            </Text>
            {isRunning && <View style={styles.runningIndicator} />}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        borderRadius: 6,
        marginHorizontal: 2,
    },
    tabButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    tabButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 11,
        marginBottom: 1,
    },
    tabButtonTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    tabButtonLegend: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 8,
        textAlign: 'center',
        lineHeight: 10,
    },
    tabButtonLegendActive: {
        color: 'rgba(255,255,255,0.7)',
    },
    runningIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});

TabButton.displayName = 'TabButton';

export default TabButton;
