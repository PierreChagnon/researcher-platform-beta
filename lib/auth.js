// Fonctions d'authentification qui ne s'exécutent que côté client
export const signUp = async (email, password, name) => {
    if (typeof window === "undefined") {
        return { user: null, error: "This function is only available on the client side" }
    }

    try {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
        const { doc, setDoc } = await import("firebase/firestore")
        const { auth, db } = await import("@/lib/firebase")

        if (!auth || !db) {
            throw new Error("Firebase is not initialized")
        }

        // Créer l'utilisateur avec Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Mettre à jour le profil avec le nom
        await updateProfile(user, {
            displayName: name,
        })

        // Définir le cookie d'authentification
        await setAuthCookie(user)

        // Création du customer dans Stripe
        const createStripeCustomer = async () => {
            const { stripe } = await import("@/lib/stripe")
            if (!stripe) {
                throw new Error("Stripe is not initialized")
            }
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.displayName || name,
            })
            return customer.id
        }

        // Créer le document utilisateur dans Firestore
        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
            // Données par défaut du profil
            title: "",
            institution: "",
            bio: "",
            orcid: "",
            website: "",
            location: "",
            social: {
                twitter: "",
                linkedin: "",
                github: "",
            },
            // Paramètres par défaut du site
            siteSettings: {
                siteName: `${name} - Researcher`,
                siteDescription: `Personal website of ${name}`,
                siteUrl: name.toLowerCase().replace(/\s+/g, ""),
                theme: "system",
                accentColor: "blue",
                googleAnalyticsId: "",
            },
            // Abonnement par défaut
            subscription: {
            }
        })

        return { user, error: null }
    } catch (error) {
        return { user: null, error: error.message }
    }
}

export const signIn = async (email, password) => {
    if (typeof window === "undefined") {
        return { user: null, error: "This function is only available on the client side" }
    }

    try {
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        const { auth } = await import("@/lib/firebase")

        if (!auth) {
            throw new Error("Firebase Auth is not initialized")
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Définir le cookie d'authentification
        await setAuthCookie(userCredential.user)

        return { user: userCredential.user, error: null }
    } catch (error) {
        return { user: null, error: error.message }
    }
}

export const signOut = async () => {
    if (typeof window === "undefined") {
        return { error: "This function is only available on the client side" }
    }

    try {
        const { signOut: firebaseSignOut } = await import("firebase/auth")
        const { auth } = await import("@/lib/firebase")

        if (!auth) {
            throw new Error("Firebase Auth is not initialized")
        }

        await firebaseSignOut(auth)

        // Supprimer le cookie d'authentification
        await removeAuthCookie()

        return { error: null }
    } catch (error) {
        return { error: error.message }
    }
}

export const getUserData = async (uid) => {
    try {
        const { doc, getDoc } = await import("firebase/firestore")
        const { db } = await import("@/lib/firebase")

        if (!db) {
            throw new Error("Firestore is not initialized")
        }

        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { data: docSnap.data(), error: null }
        } else {
            return { data: null, error: "User not found" }
        }
    } catch (error) {
        return { data: null, error: error.message }
    }
}

// Fonction pour définir le cookie d'authentification côté client
const setAuthCookie = async (user) => {
    if (typeof window !== "undefined") {
        try {
            const token = await user.getIdToken()
            // Utiliser l'API fetch pour appeler notre route API qui définira le cookie
            await fetch("/api/auth/set-cookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
        } catch (error) {
            console.error("Error setting cookie:", error)
        }
    }
}

// Fonction pour supprimer le cookie d'authentification côté client
const removeAuthCookie = async () => {
    if (typeof window !== "undefined") {
        // Utiliser l'API fetch pour appeler notre route API qui supprimera le cookie
        await fetch("/api/auth/remove-cookie", {
            method: "POST",
        })
    }
}
