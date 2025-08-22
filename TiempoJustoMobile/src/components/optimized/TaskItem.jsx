import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const TaskItem = memo(({ 
    task, 
    projectName, 
    onToggle, 
    onRemove, 
    onMoveToDaily 
}) => {
    const priorityColors = {
        A: '#ef4444',
        B: '#f97316', 
        C: '#eab308',
        D: '#6b7280'
    };

    const priority = task.priority || 'C';
    const priorityColor = priorityColors[priority];

    return (
        <View style={[styles.taskItem, task.done && styles.taskItemDone]}>
            <Pressable 
                style={styles.taskContent}
                onPress={() => onToggle(task.id)}
            >
                <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
                <View style={styles.taskTextContainer}>
                    <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>
                        {task.title}
                    </Text>
                    {projectName && (
                        <Text style={styles.projectName}>{projectName}</Text>
                    )}
                </View>
                <Text style={styles.priorityText}>{priority}</Text>
            </Pressable>
            
            <View style={styles.taskActions}>
                {task.projectId && (
                    <Pressable 
                        style={styles.actionButton}
                        onPress={() => onMoveToDaily(task.id)}
                    >
                        <Text style={styles.actionButtonText}>📋</Text>
                    </Pressable>
                )}
                <Pressable 
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => onRemove(task.id)}
                >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                </Pressable>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    taskItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    taskItemDone: {
        opacity: 0.6,
        borderLeftColor: '#10b981',
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    taskTextContainer: {
        flex: 1,
    },
    taskTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: 'rgba(255,255,255,0.6)',
    },
    projectName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    priorityText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 8,
    },
    taskActions: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
    },
    removeButton: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: 'rgba(255,255,255,0.1)',
    },
    actionButtonText: {
        fontSize: 16,
    },
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
