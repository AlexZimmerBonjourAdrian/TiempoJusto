import { NextResponse } from 'next/server'
import { getGoogleAdsCampaigns, refreshAccessToken } from '@/lib/google-ads'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const customerId = searchParams.get('customerId')

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
        }

        const supabase = createServerSupabaseClient()

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Obtener tokens del usuario
        const { data: tokens, error: tokensError } = await supabase
            .from('google_ads_tokens')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (tokensError || !tokens) {
            return NextResponse.json({ error: 'Google Ads not connected' }, { status: 400 })
        }

        // Verificar si el token ha expirado
        const isExpired = new Date(tokens.expires_at) <= new Date()

        let accessToken = tokens.access_token

        if (isExpired && tokens.refresh_token) {
            try {
                const newTokens = await refreshAccessToken(tokens.refresh_token)
                accessToken = newTokens.access_token

                // Actualizar tokens en la base de datos
                await supabase
                    .from('google_ads_tokens')
                    .update({
                        access_token: newTokens.access_token,
                        expires_at: new Date(newTokens.expiry_date).toISOString()
                    })
                    .eq('user_id', user.id)
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError)
                return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 })
            }
        }

        // Obtener campañas
        const campaigns = await getGoogleAdsCampaigns(
            accessToken,
            tokens.refresh_token,
            customerId
        )

        return NextResponse.json(campaigns)
    } catch (error) {
        console.error('Error fetching campaigns:', error)
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }
}