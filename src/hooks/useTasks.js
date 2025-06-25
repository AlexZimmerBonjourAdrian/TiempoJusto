import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTasks(date = null) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const targetDate = date || new Date().toISOString().split('T')[0]

    // Cargar tareas
    const loadTasks = async() => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/tasks?date=${targetDate}`)

            if (!response.ok) {
                throw new Error('Failed to fetch tasks')
            }

            const data = await response.json()
            setTasks(data)
        } catch (err) {
            console.error('Error loading tasks:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Crear nueva tarea
    const createTask = async(taskData) => {
        try {
            setError(null)

            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskData,
                    date: targetDate
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create task')
            }

            const newTask = await response.json()
            setTasks(prev => [...prev, newTask])
            return newTask
        } catch (err) {
            console.error('Error creating task:', err)
            setError(err.message)
            throw err
        }
    }

    // Actualizar tarea
    const updateTask = async(id, updates) => {
        try {
            setError(null)

            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            })

            if (!response.ok) {
                throw new Error('Failed to update task')
            }

            const updatedTask = await response.json()
            setTasks(prev =>
                prev.map(task =>
                    task.id === id ? updatedTask : task
                )
            )
            return updatedTask
        } catch (err) {
            console.error('Error updating task:', err)
            setError(err.message)
            throw err
        }
    }

    // Eliminar tarea
    const deleteTask = async(id) => {
        try {
            setError(null)

            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete task')
            }

            setTasks(prev => prev.filter(task => task.id !== id))
        } catch (err) {
            console.error('Error deleting task:', err)
            setError(err.message)
            throw err
        }
    }

    // Marcar tarea como completada
    const toggleTaskComplete = async(id, completed) => {
        return updateTask(id, { completed })
    }

    // Cambiar prioridad de tarea
    const updateTaskPriority = async(id, priority) => {
        return updateTask(id, { priority })
    }

    // Cargar tareas al montar el componente o cambiar fecha
    useEffect(() => {
        loadTasks()
    }, [targetDate])

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        updateTaskPriority,
        refreshTasks: loadTasks,
    }
}