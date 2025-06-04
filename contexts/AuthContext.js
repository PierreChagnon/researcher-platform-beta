"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Importer Firebase Auth seulement côté client
        const initializeAuth = async () => {
            if (typeof window !== "undefined") {
                try {
                    const { onAuthStateChanged } = await import("firebase/auth")
                    const { auth } = await import("@/lib/firebase")
                    const { getUserData } = await import("@/lib/auth")

                    if (auth) {
                        const unsubscribe = onAuthStateChanged(auth, async (user) => {
                            if (user) {
                                setUser(user)
                                // Récupérer les données utilisateur depuis Firestore
                                const { data } = await getUserData(user.uid)
                                setUserData(data)
                            } else {
                                setUser(null)
                                setUserData(null)
                            }
                            setLoading(false)
                        })

                        return () => unsubscribe()
                    }
                } catch (error) {
                    console.error("Erreur lors de l'initialisation de l'authentification:", error)
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const refreshUserData = async () => {
        if (user && typeof window !== "undefined") {
            const { getUserData } = await import("@/lib/auth")
            const { data } = await getUserData(user.uid)
            setUserData(data)
        }
    }

    const value = {
        user,
        userData,
        loading,
        refreshUserData,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
