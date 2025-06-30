// Task Types
export const TaskShape = {
    id: 'number',
    text: 'string',
    completed: 'boolean',
    timestamp: 'Date',
    importance: 'string'
};

// Project Types
export const ProjectShape = {
    id: 'string',
    name: 'string',
    description: 'string',
    status: 'active' | 'completed' | 'paused',
    createdAt: 'Date',
    updatedAt: 'Date',
    deadline: 'Date?',
    estimatedHours: 'number',
    actualHours: 'number',
    tasks: 'Task[]'
};

// Log Types
export const LogEntryShape = {
    date: 'string',
    completedTasks: 'number',
    totalTasks: 'number',
    productivity: 'number'
};

// Task Log Types
export const TaskLogEntryShape = {
    date: 'string',
    task: 'string',
    completed: 'boolean'
};

// ADHD View Types
export const ADHDViewState = {
    focusMode: 'boolean'
};

// Calculator Types
export const TimeCalculation = {
    startTime: 'string',
    endTime: 'string',
    duration: 'string',
    errorMessage: 'string'
};

// Component Props Types
export const ComponentProps = {
    Task: {
        task: TaskShape,
        onComplete: 'function',
        onDelete: 'function'
    },
    TaskBoard: {
        tasks: '[TaskShape]',
        onAddTask: 'function',
        onCompleteTask: 'function',
        onDeleteTask: 'function'
    },
    ADHDView: {
        hasADHD: 'boolean',
        toggleADHDMode: 'function'
    },
    Footer: {
        hasADHD: 'boolean',
        toggleADHDMode: 'function'
    }
};