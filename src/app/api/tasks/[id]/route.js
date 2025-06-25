import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET - Obtener tarea específica
export async function GET(request, { params }) {
    try {
        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        // Obtener tarea específica del usuario
        const { data: task, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Task not found' }, { status: 404 })
            }
            console.error('Error fetching task:', error)
            return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
        }

        return NextResponse.json(task)
    } catch (error) {
        console.error('Error in GET /api/tasks/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT - Actualizar tarea
export async function PUT(request, { params }) {
    try {
        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()
        const { title, description, priority, completed, estimated_hours } = body

        // Actualizar tarea
        const { data: task, error } = await supabase
            .from('tasks')
            .update({
                title: title || undefined,
                description: description || undefined,
                priority: priority || undefined,
                completed: completed !== undefined ? completed : undefined,
                estimated_hours: estimated_hours || undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating task:', error)
            return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
        }

        return NextResponse.json(task)
    } catch (error) {
        console.error('Error in PUT /api/tasks/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Eliminar tarea
export async function DELETE(request, { params }) {
    try {
        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        // Eliminar tarea
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error deleting task:', error)
            return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Task deleted successfully' })
    } catch (error) {
        console.error('Error in DELETE /api/tasks/[id]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}