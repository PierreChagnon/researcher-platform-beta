"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useTeaching() {
    const [teachings, setTeachings] = useState([])
    const [guestLectures, setGuestLectures] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const fetchTeachingData = async () => {
        if (!user || !db) {
            setTeachings([])
            setGuestLectures([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            // Récupération des enseignements
            const teachingsQuery = query(
                collection(db, "teachings"),
                where("userId", "==", user.uid),
                orderBy("year", "desc"),
            )

            // Récupération des conférences invitées
            const guestLecturesQuery = query(
                collection(db, "guestLectures"),
                where("userId", "==", user.uid),
                orderBy("year", "desc"),
            )

            const [teachingsSnapshot, guestLecturesSnapshot] = await Promise.all([
                getDocs(teachingsQuery),
                getDocs(guestLecturesQuery),
            ])

            const teachingsData = teachingsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            const guestLecturesData = guestLecturesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setTeachings(teachingsData)
            setGuestLectures(guestLecturesData)
        } catch (error) {
            console.error("Erreur lors de la récupération des données d'enseignement:", error)
            setTeachings([])
            setGuestLectures([])
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
        guestLectures,
        loading,
        refreshTeachingData,
    }
}
