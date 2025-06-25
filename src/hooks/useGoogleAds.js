import { useState, useEffect } from 'react'

export function useGoogleAds() {
    const [campaigns, setCampaigns] = useState([])
    const [metrics, setMetrics] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    // Verificar si Google Ads está conectado
    const checkConnection = async() => {
        try {
            const response = await fetch('/api/auth/google')
            if (response.ok) {
                setIsConnected(true)
            }
        } catch (err) {
            setIsConnected(false)
        }
    }

    // Obtener URL de autorización
    const getAuthUrl = async() => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/auth/google')

            if (!response.ok) {
                throw new Error('Failed to get auth URL')
            }

            const { authUrl } = await response.json()
            return authUrl
        } catch (err) {
            console.error('Error getting auth URL:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Conectar Google Ads
    const connectGoogleAds = async() => {
        try {
            const authUrl = await getAuthUrl()
            window.location.href = authUrl
        } catch (err) {
            console.error('Error connecting Google Ads:', err)
            throw err
        }
    }

    // Obtener campañas
    const fetchCampaigns = async(customerId) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/google-ads/campaigns?customerId=${customerId}`)

            if (!response.ok) {
                throw new Error('Failed to fetch campaigns')
            }

            const data = await response.json()
            setCampaigns(data.results || [])
            return data
        } catch (err) {
            console.error('Error fetching campaigns:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Obtener métricas
    const fetchMetrics = async(customerId, dateRange) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/google-ads/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    dateRange
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch metrics')
            }

            const data = await response.json()
            setMetrics(data.results || [])
            return data
        } catch (err) {
            console.error('Error fetching metrics:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Desconectar Google Ads
    const disconnectGoogleAds = async() => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/auth/google', {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to disconnect Google Ads')
            }

            setIsConnected(false)
            setCampaigns([])
            setMetrics([])
        } catch (err) {
            console.error('Error disconnecting Google Ads:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Verificar conexión al montar el componente
    useEffect(() => {
        checkConnection()
    }, [])

    return {
        campaigns,
        metrics,
        loading,
        error,
        isConnected,
        connectGoogleAds,
        disconnectGoogleAds,
        fetchCampaigns,
        fetchMetrics,
        refreshConnection: checkConnection,
    }
}