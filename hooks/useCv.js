"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getCvData } from "@/lib/actions/cv-actions"

export function useCv() {
    const { user } = useAuth()
    const [cvData, setCvData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCvData = async () => {
            if (!user?.uid) {
                setLoading(false)
                return
            }

            try {
                const { cvData: data, error: fetchError } = await getCvData(user.uid)
                if (fetchError) {
                    setError(fetchError)
                } else {
                    setCvData(data)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCvData()
    }, [user])

    const refreshCvData = async () => {
        if (!user?.uid) return

        setLoading(true)
        try {
            const { cvData: data, error: fetchError } = await getCvData(user.uid)
            if (fetchError) {
                setError(fetchError)
            } else {
                setCvData(data)
                setError(null)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        cvData,
        loading,
        error,
        refreshCvData,
    }
}
