import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Configuración de Google Ads API
const GOOGLE_ADS_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const GOOGLE_ADS_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const GOOGLE_ADS_DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const GOOGLE_ADS_LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID

// Crear cliente OAuth2
export function createOAuth2Client() {
    return new OAuth2Client(
        GOOGLE_ADS_CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET,
        'http://localhost:3000/api/auth/google/callback'
    )
}

// Crear cliente de Google Ads
export function createGoogleAdsClient(accessToken, refreshToken) {
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    })

    return google.ads({
        version: 'v16',
        auth: oauth2Client,
    })
}

// Obtener campañas de Google Ads
export async function getGoogleAdsCampaigns(accessToken, refreshToken, customerId) {
    try {
        const adsClient = createGoogleAdsClient(accessToken, refreshToken)

        const response = await adsClient.customers.campaigns.list({
            customerId: customerId,
            query: `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `
        })

        return response.data
    } catch (error) {
        console.error('Error fetching Google Ads campaigns:', error)
        throw error
    }
}

// Obtener métricas de rendimiento
export async function getGoogleAdsMetrics(accessToken, refreshToken, customerId, dateRange) {
    try {
        const adsClient = createGoogleAdsClient(accessToken, refreshToken)

        const response = await adsClient.customers.googleAds.search({
            customerId: customerId,
            query: `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.average_cpc
        FROM campaign 
        WHERE segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
        ORDER BY metrics.cost_micros DESC
      `
        })

        return response.data
    } catch (error) {
        console.error('Error fetching Google Ads metrics:', error)
        throw error
    }
}

// Obtener URL de autorización
export function getGoogleAdsAuthUrl() {
    const oauth2Client = createOAuth2Client()

    const scopes = [
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    })
}

// Intercambiar código por tokens
export async function exchangeCodeForTokens(code) {
    const oauth2Client = createOAuth2Client()

    const { tokens } = await oauth2Client.getToken(code)
    return tokens
}

// Refrescar token
export async function refreshAccessToken(refreshToken) {
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({ refresh_token: refreshToken })

    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
}