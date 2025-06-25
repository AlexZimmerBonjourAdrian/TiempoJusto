import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error) {
        // Redirigir a página de error
        return redirect('/auth/error?message=Google+Ads+authorization+failed')
    }

    if (!code) {
        return redirect('/auth/error?message=No+authorization+code+received')
    }

    // Redirigir a página de éxito con el código
    return redirect(`/auth/success?code=${code}&state=${state}`)
}