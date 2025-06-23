"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPublications } from "@/lib/firestore"

export function usePublications() {
    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const fetchPublications = async () => {
        if (!user) return

        setLoading(true)
        try {
            const { publications: userPubs, error } = await getUserPublications(user.uid)
            if (error) {
                setError(error)
            } else {
                setPublications(userPubs)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPublications()
    }, [user])

    const refreshPublications = () => {
        fetchPublications()
    }

    // Computed statistics
    const stats = {
        total: publications.length,
        totalCitations: publications.reduce((sum, pub) => sum + (pub.citations || 0), 0),
        averageCitations:
            publications.length > 0
                ? (publications.reduce((sum, pub) => sum + (pub.citations || 0), 0) / publications.length).toFixed(1)
                : 0,
        publicationsByYear: publications.reduce((acc, pub) => {
            const year = pub.year || new Date(pub.publicationDate).getFullYear()
            acc[year] = (acc[year] || 0) + 1
            return acc
        }, {}),
        recentPublications: publications.filter((pub) => {
            const year = pub.year || new Date(pub.publicationDate).getFullYear()
            return year >= new Date().getFullYear() - 5
        }).length,
        openAccessCount: publications.filter((pub) => pub.openAccess).length,
        manualCount: publications.filter((pub) => pub.source === "manual").length,
        openAlexCount: publications.filter((pub) => pub.source === "openalex").length,
    }

    return {
        publications,
        loading,
        error,
        stats,
        refreshPublications,
    }
}
