import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const QuickFilters = ({ selectedFilter, onFilterChange }) => {
    const filters = [
        { key: 'all', label: 'Todo', icon: '📊' },
        { key: 'today', label: 'Hoy', icon: '📅' },
        { key: 'week', label: 'Esta Semana', icon: '📈' },
        { key: 'month', label: 'Este Mes', icon: '📆' },
        { key: 'completed', label: 'Completadas', icon: '✅' },
        { key: 'pending', label: 'Pendientes', icon: '⏳' },
        { key: 'high_priority', label: 'Alta Prioridad', icon: '🔥' },
        { key: 'projects', label: 'Por Proyectos', icon: '📁' },
        { key: 'efficiency', label: 'Eficiencia', icon: '⚡' },
        { key: 'trends', label: 'Tendencias', icon: '📉' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filtros Rápidos</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
            >
                {filters.map((filter) => (
                    <Pressable
                        key={filter.key}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter.key && styles.filterButtonActive
                        ]}
                        onPress={() => onFilterChange(filter.key)}
                    >
                        <Text style={styles.filterIcon}>{filter.icon}</Text>
                        <Text style={[
                            styles.filterText,
                            selectedFilter === filter.key && styles.filterTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        marginHorizontal: 20,
    },
    filtersContainer: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        minWidth: 80,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    filterButtonActive: {
        backgroundColor: '#7ED321',
        borderColor: '#7ED321',
    },
    filterIcon: {
        fontSize: 16,
        marginBottom: 4,
    },
    filterText: {
        fontSize: 12,
        color: '#CCCCCC',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default QuickFilters;
