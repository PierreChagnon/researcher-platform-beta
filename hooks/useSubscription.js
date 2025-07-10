"use client"

import { useState, useEffect, useCallback } from "react"

export function useSubscription() {
    console.log("useSubscription hook initialized")
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSubscription = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/stripe/subscription", {
                method: "GET",
                credentials: "include", // Important pour les cookies
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setSubscription(data.subscription)
            console.log("Subscription fetched successfully:", data)
        } catch (err) {
            console.error("Error fetching subscription:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fonction pour rafraîchir manuellement
    const refresh = useCallback(() => {
        fetchSubscription()
    }, [fetchSubscription])

    // Fetch initial
    useEffect(() => {
        fetchSubscription()
    }, [fetchSubscription])

    // Auto-refresh toutes les 5 minutes (optionnel)
    useEffect(() => {
        const interval = setInterval(
            () => {
                if (!loading) {
                    fetchSubscription()
                }
            },
            5 * 60 * 1000,
        ) // 5 minutes

        return () => clearInterval(interval)
    }, [fetchSubscription, loading])

    console.log("useSubscription hook state:", {
        subscription,
        loading,
        error,
        isActive: subscription?.subscriptionStatus === "active",
    })

    return {
        subscription,
        loading,
        error,
        refresh,
        // Helpers utiles
        isActive: subscription?.subscriptionStatus === "active",
        isPending: subscription?.subscriptionStatus === "pending",
        isCancelled: subscription?.subscriptionStatus === "cancelled",
        plan: subscription?.plan || null,
        customerId: subscription?.customerId || null,
    }
}
