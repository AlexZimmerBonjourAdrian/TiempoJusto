import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ProjectHistory = ({ projects }) => {
    // Ordenar proyectos por fecha de creación (más recientes primero)
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    }, [projects]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 'En progreso';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return `${days} día${days !== 1 ? 's' : ''}`;
    };

    const getStatusColor = (completedAt) => {
        return completedAt ? '#7ED321' : '#FFA500';
    };

    const getStatusText = (completedAt) => {
        return completedAt ? 'Completado' : 'Activo';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Proyectos</Text>
            
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {sortedProjects.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay proyectos registrados</Text>
                    </View>
                ) : (
                    sortedProjects.map((project) => (
                        <View key={project.id} style={styles.projectCard}>
                            <View style={styles.projectHeader}>
                                <Text style={styles.projectName}>{project.name}</Text>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(project.completedAt) }
                                ]}>
                                    <Text style={styles.statusText}>
                                        {getStatusText(project.completedAt)}
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.projectDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Apertura:</Text>
                                    <Text style={styles.detailValue}>
                                        {formatDate(project.createdAt)}
                                    </Text>
                                </View>
                                
                                {project.completedAt && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Cierre:</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDate(project.completedAt)}
                                        </Text>
                                    </View>
                                )}
                                
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Duración:</Text>
                                    <Text style={styles.detailValue}>
                                        {calculateDuration(project.createdAt, project.completedAt)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        marginTop: 10,
        maxHeight: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        color: '#999999',
        fontSize: 14,
    },
    projectCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    projectName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    projectDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#CCCCCC',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default ProjectHistory;
