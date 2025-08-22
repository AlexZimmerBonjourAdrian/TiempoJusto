import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const ProjectItem = memo(({ 
    project, 
    taskCount, 
    isExpanded, 
    onToggleExpansion, 
    onComplete, 
    onRemove 
}) => {
    return (
        <View style={styles.projectItem}>
            <Pressable 
                style={styles.projectHeader}
                onPress={() => onToggleExpansion(project.id)}
            >
                <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.taskCount}>
                        {taskCount} tarea{taskCount !== 1 ? 's' : ''}
                    </Text>
                </View>
                <Text style={styles.expandIcon}>
                    {isExpanded ? '▼' : '▶'}
                </Text>
            </Pressable>
            
            {isExpanded && (
                <View style={styles.projectActions}>
                    <Pressable 
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => onComplete(project.id)}
                    >
                        <Text style={styles.actionButtonText}>✅ Completar</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.actionButton, styles.removeButton]}
                        onPress={() => onRemove(project.id)}
                    >
                        <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    projectItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    projectInfo: {
        flex: 1,
    },
    projectName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    taskCount: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    expandIcon: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginLeft: 8,
    },
    projectActions: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    completeButton: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    removeButton: {
        backgroundColor: 'rgba(239,68,68,0.1)',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

ProjectItem.displayName = 'ProjectItem';

export default ProjectItem;
