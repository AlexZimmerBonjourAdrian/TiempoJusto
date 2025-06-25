import { NextResponse } from 'next/server'
import { getGoogleAdsAuthUrl, exchangeCodeForTokens } from '@/lib/google-ads'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET - Obtener URL de autorización
export async function GET() {
    try {
        const authUrl = getGoogleAdsAuthUrl()
        return NextResponse.json({ authUrl })
    } catch (error) {
        console.error('Error generating auth URL:', error)
        return NextResponse.json({ error: 'Failed to generate authorization URL' }, { status: 500 })
    }
}

// POST - Intercambiar código por tokens
export async function POST(request) {
    try {
        const { code, userId } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 })
        }

        // Intercambiar código por tokens
        const tokens = await exchangeCodeForTokens(code)

        // Guardar tokens en Supabase
        const supabase = createServerSupabaseClient()

        const { error } = await supabase
            .from('google_ads_tokens')
            .upsert({
                user_id: userId,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: new Date(tokens.expiry_date).toISOString(),
                scope: tokens.scope
            })

        if (error) {
            console.error('Error saving tokens:', error)
            return NextResponse.json({ error: 'Failed to save tokens' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Google Ads connected successfully'
        })
    } catch (error) {
        console.error('Error exchanging code for tokens:', error)
        return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 500 })
    }
}