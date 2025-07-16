"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPublications } from "@/lib/firestore"

const PUBLICATION_CATEGORIES = [
    { value: "article", label: "Articles", color: "bg-purple-100 text-purple-800" },
    { value: "preprint", label: "Preprints", color: "bg-pink-100 text-pink-800" },
    { value: "book-chapter", label: "Book Chapters", color: "bg-blue-100 text-blue-800" },
    { value: "book", label: "Books & Monographs", color: "bg-yellow-100 text-yellow-800" },
    { value: "book-section", label: "Book Sections/Parts", color: "bg-lime-100 text-lime-800" },
    { value: "review", label: "Review Articles", color: "bg-indigo-100 text-indigo-800" },
    { value: "dissertation", label: "Dissertations & Theses", color: "bg-green-100 text-green-800" },
    { value: "report", label: "Reports", color: "bg-sky-100 text-sky-800" },
    { value: "dataset", label: "Datasets", color: "bg-orange-100 text-orange-800" },
    { value: "editorial", label: "Editorials", color: "bg-rose-100 text-rose-800" },
    { value: "letter", label: "Letters", color: "bg-teal-100 text-teal-800" },
    { value: "erratum", label: "Errata & Corrections", color: "bg-red-100 text-red-800" },
    { value: "paratext", label: "Paratexts", color: "bg-fuchsia-100 text-fuchsia-800" },
    { value: "libguides", label: "Library Guides", color: "bg-cyan-100 text-cyan-800" },
    { value: "reference-entry", label: "Reference Entries", color: "bg-emerald-100 text-emerald-800" },
    { value: "peer-review", label: "Peer Reviews", color: "bg-gray-100 text-gray-800" },
    { value: "supplementary-materials", label: "Supplementary Materials", color: "bg-yellow-100 text-yellow-800" },
    { value: "standard", label: "Standards", color: "bg-blue-100 text-blue-800" },
    { value: "grant", label: "Grants", color: "bg-green-100 text-green-800" },
    { value: "retraction", label: "Retractions", color: "bg-red-100 text-red-800" },
    { value: "proceedings", label: "Conference Proceedings", color: "bg-indigo-100 text-indigo-800" },
    { value: "journal", label: "Journals (as entities)", color: "bg-indigo-200 text-indigo-900" },
    { value: "book-set", label: "Book Sets", color: "bg-yellow-200 text-yellow-900" },
    { value: "component", label: "Components", color: "bg-gray-100 text-gray-800" },
    { value: "posted-content", label: "Posted Content", color: "bg-pink-50 text-pink-800" },
    { value: "other", label: "Other", color: "bg-gray-200 text-gray-800" }
];

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
        const filtered = publications.filter((pub) => pub.type === category.value)
        return {
            ...category,
            publications: filtered,
            count: filtered.length,
        }
    }
    ).filter((cat) => cat.count > 0)

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
