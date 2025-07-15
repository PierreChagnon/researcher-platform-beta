"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useTeaching() {
    const [teachings, setTeachings] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const fetchTeachingData = async () => {
        if (!user || !db) {
            setTeachings([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            // Fetch teachings
            const teachingsQuery = query(
                collection(db, "teachings"),
                where("userId", "==", user.uid),
                orderBy("year", "desc"),
            )

            const teachingsSnapshot = await getDocs(teachingsQuery)

            const teachingsData = teachingsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setTeachings(teachingsData)
        } catch (error) {
            console.error("Error while fetching teaching data:", error)
            setTeachings([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeachingData()
    }, [user])

    const refreshTeachingData = () => {
        fetchTeachingData()
    }

    return {
        teachings,
        loading,
        refreshTeachingData,
    }
}
