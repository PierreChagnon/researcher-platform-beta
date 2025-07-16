"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const TEACHING_CATEGORIES = [
    { value: "lecturer", label: "Lecturer", color: "bg-purple-100 text-purple-800" },
    { value: "teaching-assistant", label: "Teaching Assistant", color: "bg-red-100 text-red-800" },
    { value: "guest-lecture", label: "Guest Lecture", color: "bg-blue-100 text-blue-800" },
]

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

    // Filtered teachings by category
    const categorizedTeachings = TEACHING_CATEGORIES.map((category) => {
        const filtered = teachings.filter((teach) => teach.category === category.value)
        return {
            ...category,
            teachings: filtered,
            count: filtered.length,
        }
    }
    ).filter((cat) => cat.count > 0)

    useEffect(() => {
        fetchTeachingData()
    }, [user])

    const refreshTeachingData = () => {
        fetchTeachingData()
    }

    return {
        teachings,
        categorizedTeachings,
        loading,
        refreshTeachingData,
    }
}
