"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
    const router = useRouter()

    // Fonction pour rafraîchir le token
    const refreshAuthToken = async (currentUser) => {
        if (currentUser && typeof window !== "undefined") {
            try {
                console.log("🔄 Refreshing token...")
                const token = await currentUser.getIdToken(true) // Force refresh

                const response = await fetch("/api/auth/set-cookie", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                })

                if (!response.ok) {
                    throw new Error("Failed to set cookie")
                }

                console.log("✅ Token refreshed successfully")
                return true
            } catch (error) {
                console.error("❌ Error refreshing token:", error)
                // Si le rafraîchissement échoue, déconnecter l'utilisateur
                await handleSignOut()
                return false
            }
        }
        return false
    }

    // Fonction pour déconnecter l'utilisateur
    const handleSignOut = async () => {
        try {
            const { signOut } = await import("@/lib/auth")
            await signOut()
            router.push("/login")
        } catch (error) {
            console.error("Error signing out:", error)
            router.push("/login")
        }
    }

    useEffect(() => {
        // Import Firebase Auth only on the client side
        const initializeAuth = async () => {
            if (typeof window !== "undefined") {
                try {
                    const { onAuthStateChanged } = await import("firebase/auth")
                    const { auth } = await import("@/lib/firebase")
                    const { getUserData } = await import("@/lib/auth")

                    if (auth) {
                        const unsubscribe = onAuthStateChanged(auth, async (user) => {
                            try {
                                if (user) {
                                    setUser(user)

                                    // Rafraîchir le token au démarrage
                                    const refreshSuccess = await refreshAuthToken(user)
                                    if (!refreshSuccess) {
                                        return // L'utilisateur sera déconnecté
                                    }

                                    // Retrieve user data from Firestore
                                    const { data } = await getUserData(user.uid)
                                    setUserData(data)

                                    // Programmer le rafraîchissement automatique du token (toutes les 45 minutes)
                                    const tokenRefreshInterval = setInterval(
                                        async () => {
                                            console.log("🔄 Automatic token refresh...")
                                            await refreshAuthToken(user)
                                        },
                                        45 * 60 * 1000, // 45 minutes
                                    )

                                    // Nettoyer l'intervalle quand l'utilisateur se déconnecte
                                    return () => clearInterval(tokenRefreshInterval)
                                } else {
                                    setUser(null)
                                    setUserData(null)
                                }
                            } catch (error) {
                                console.error("Error during auth state change:", error)
                            } finally {
                                // IMPORTANT: Toujours mettre loading à false
                                setLoading(false)
                            }
                        })

                        return () => unsubscribe()
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("Error during authentication initialization:", error)
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [router])

    const refreshUserData = async () => {
        if (user && typeof window !== "undefined") {
            try {
                // Rafraîchir le token avant de récupérer les données
                const refreshSuccess = await refreshAuthToken(user)
                if (!refreshSuccess) {
                    return
                }

                const { getUserData } = await import("@/lib/auth")
                const { data } = await getUserData(user.uid)
                setUserData(data)
            } catch (error) {
                console.error("Error refreshing user data:", error)
            }
        }
    }

    const value = {
        user,
        userData,
        loading,
        refreshUserData,
        refreshAuthToken: () => refreshAuthToken(user),
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
