import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET - Obtener todas las tareas del usuario
export async function GET(request) {
    try {
        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

        // Obtener tareas del usuario para la fecha específica
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', date)
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching tasks:', error)
            return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
        }

        return NextResponse.json(tasks)
    } catch (error) {
        console.error('Error in GET /api/tasks:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Crear nueva tarea
export async function POST(request) {
    try {
        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, priority, date, estimated_hours } = body

        if (!title || !date) {
            return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })
        }

        // Crear nueva tarea
        const { data: task, error } = await supabase
            .from('tasks')
            .insert({
                user_id: user.id,
                title,
                description: description || '',
                priority: priority || 1,
                date,
                estimated_hours: estimated_hours || null,
                completed: false,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating task:', error)
            return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
        }

        return NextResponse.json(task, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/tasks:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}