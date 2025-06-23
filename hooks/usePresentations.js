"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

    useEffect(() => {
        fetchPresentations()
    }, [user])

    const refreshPresentations = () => {
        fetchPresentations()
    }

    return {
        presentations,
        loading,
        refreshPresentations,
    }
}
