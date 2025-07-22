"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPublications } from "@/lib/firestore"

const PUBLICATION_CATEGORIES = [
    { value: "articles", label: "Articles", color: "bg-purple-100 text-purple-800" },                      // Articles, Reviews, Reports
    { value: "preprints", label: "Preprints", color: "bg-pink-100 text-pink-800" },                        // Preprints
    { value: "book-chapters", label: "Book Chapters", color: "bg-blue-100 text-blue-800" },                // Book chapters, Book sections/parts
    { value: "books", label: "Books & Monographs", color: "bg-yellow-100 text-yellow-800" },               // Books & Monographs
    { value: "dissertations-and-theses", label: "Dissertations & Theses", color: "bg-green-100 text-green-800" }, // Dissertations & Theses
    { value: "datasets", label: "Datasets", color: "bg-orange-100 text-orange-800" },                      // Datasets
    { value: "errata-and-corrections", label: "Errata & Corrections", color: "bg-red-100 text-red-800" },  // Errata & Corrections
    { value: "conference-proceedings", label: "Conference Proceedings", color: "bg-indigo-100 text-indigo-800" }, // Conference Proceedings
    { value: "letters-and-commentaries", label: "Letters & Commentaries", color: "bg-teal-100 text-teal-800" },  // Letters & Commentaries
    { value: "other", label: "Other", color: "bg-gray-200 text-gray-800" },                                // Tout le reste !
]


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

    // Filtered publications by category
    const categorizedPublications = PUBLICATION_CATEGORIES.map((category) => {
        const filtered = publications
            .filter((pub) => pub.type === category.value)
            .sort((a, b) => {
                const yearA = a.year || new Date(a.publicationDate).getFullYear()
                const yearB = b.year || new Date(b.publicationDate).getFullYear()
                return yearB - yearA
            })
        return {
            ...category,
            publications: filtered,
            count: filtered.length,
        }
    }).filter((cat) => cat.count > 0)

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
        categorizedPublications,
        loading,
        error,
        stats,
        refreshPublications,
    }
}
