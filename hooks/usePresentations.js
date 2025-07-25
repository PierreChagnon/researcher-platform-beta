"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const PRESENTATION_CATEGORIES = [
    { value: "invited-speaker", label: "Invited Speaker", color: "bg-purple-100 text-purple-800" },
    { value: "keynote", label: "Conference Keynote Speaker", color: "bg-red-100 text-red-800" },
    { value: "long-talk", label: "Conference Long Talk", color: "bg-blue-100 text-blue-800" },
    { value: "short-talk", label: "Conference Short Talk", color: "bg-green-100 text-green-800" },
    { value: "flash-talk", label: "Conference Flash Talk", color: "bg-yellow-100 text-yellow-800" },
    { value: "poster", label: "Poster", color: "bg-gray-100 text-gray-800" },
]

export function usePresentations() {
    const [presentations, setPresentations] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const fetchPresentations = async () => {
        if (!user || !db) {
            setPresentations([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const presentationsQuery = query(
                collection(db, "presentations"),
                where("userId", "==", user.uid),
                orderBy("date", "desc"),
            )

            const querySnapshot = await getDocs(presentationsQuery)
            const presentationsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setPresentations(presentationsData)
        } catch (error) {
            console.error("Error while fetching presentations:", error)
            setPresentations([])
        } finally {
            setLoading(false)
        }
    }

    // Filtered presentations by category
    const categorizedPresentations = PRESENTATION_CATEGORIES.map((category) => {
        const filtered = presentations
            .filter((pres) => pres.category === category.value)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        return {
            ...category,
            presentations: filtered,
            count: filtered.length,
        }
    }).filter((cat) => cat.count > 0)

    useEffect(() => {
        fetchPresentations()
    }, [user])

    const refreshPresentations = () => {
        fetchPresentations()
    }
    return {
        presentations,
        categorizedPresentations,
        loading,
        refreshPresentations,
    }
}
