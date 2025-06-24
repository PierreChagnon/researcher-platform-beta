"use server"

import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

// Fonction pour vérifier l'unicité d'une URL de site
async function checkSiteUrlUniqueness(siteUrl, currentUserId) {
    try {
        const usersRef = admin.db.collection("users")
        const q = usersRef.where("siteSettings.siteUrl", "==", siteUrl)
        const querySnapshot = await q.get()

        // Si aucun résultat, l'URL est disponible
        if (querySnapshot.empty) {
            return { isUnique: true }
        }

        // Si un résultat et c'est l'utilisateur actuel, c'est OK
        if (querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === currentUserId) {
            return { isUnique: true }
        }

        // Sinon, l'URL est déjà prise
        return { isUnique: false }
    } catch (error) {
        console.error("Error while checking uniqueness:", error)
        return { isUnique: false, error: error.message }
    }
}

// Fonction pour valider le format d'une URL de site
function validateSiteUrl(siteUrl) {
    // Règles de validation :
    // - 3-30 caractères
    // - Lettres, chiffres, tirets uniquement
    // - Commence et finit par une lettre ou un chiffre
    // - Pas de mots réservés

    const urlRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/
    const reservedWords = [
        "www",
        "api",
        "admin",
        "dashboard",
        "app",
        "mail",
        "ftp",
        "blog",
        "shop",
        "store",
        "support",
        "help",
        "docs",
        "dev",
        "staging",
        "test",
        "demo",
    ]

    if (!siteUrl || siteUrl.length < 3 || siteUrl.length > 30) {
        return { isValid: false, error: "The URL must be between 3 and 30 characters long." }
    }

    if (!urlRegex.test(siteUrl)) {
        return {
            isValid: false,
            error:
                "The URL can only contain letters, numbers, and hyphens, and must start and end with a letter or number.",
        }
    }

    if (reservedWords.includes(siteUrl.toLowerCase())) {
        return { isValid: false, error: "This URL is reserved and cannot be used." }
    }

    return { isValid: true }
}

export async function updateSiteSettings(formData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Extraire les données du formulaire
        const siteName = formData.get("siteName")
        const siteDescription = formData.get("siteDescription")
        const siteUrl = formData.get("siteUrl")?.toLowerCase().trim()
        const theme = formData.get("theme")
        const accentColor = formData.get("accentColor")
        const showCitations = formData.get("showCitations") === "on"
        const showAbstract = formData.get("showAbstract") === "on"
        const showCoauthors = formData.get("showCoauthors") === "on"
        const googleAnalyticsId = formData.get("googleAnalyticsId")

        // Validation des champs obligatoires
        if (!siteName || siteName.length < 2) {
            throw new Error("The site name must be at least 2 characters long.")
        }

        if (!siteDescription || siteDescription.length < 10) {
            throw new Error("The site description must be at least 10 characters long.")
        }

        // Validation de l'URL du site
        const urlValidation = validateSiteUrl(siteUrl)
        if (!urlValidation.isValid) {
            throw new Error(urlValidation.error)
        }

        // Vérification de l'unicité de l'URL
        const uniquenessCheck = await checkSiteUrlUniqueness(siteUrl, userId)
        if (!uniquenessCheck.isUnique) {
            if (uniquenessCheck.error) {
                throw new Error(`Error during verification: ${uniquenessCheck.error}`)
            } else {
                throw new Error("This URL is already used by another researcher.")
            }
        }

        // Récupérer l'ancienne URL pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const oldSiteUrl = userDoc.data()?.siteSettings?.siteUrl

        // Préparer les nouvelles données de settings
        const newSiteSettings = {
            siteName,
            siteDescription,
            siteUrl,
            theme: theme || "system",
            accentColor: accentColor || "blue",
            showCitations,
            showAbstract,
            showCoauthors,
            googleAnalyticsId: googleAnalyticsId || "",
            updatedAt: new Date().toISOString(),
        }

        // Mettre à jour dans Firestore
        await admin.db.collection("users").doc(userId).update({
            siteSettings: newSiteSettings,
        })

        // 🎯 REVALIDATION ISR 
        console.log("🔄 ISR revalidation for:", siteUrl)

        // Revalider l'ancien site si l'URL a changé
        if (oldSiteUrl && oldSiteUrl !== siteUrl) {
            console.log("🔄 Revalidating old site:", oldSiteUrl)
            revalidatePath(`/sites/${oldSiteUrl}`)
        }

        // Revalider le nouveau site
        revalidatePath(`/sites/${siteUrl}`)

        // Revalider aussi les pages du dashboard
        revalidatePath("/dashboard/settings")
        revalidatePath("/dashboard")

        console.log("✅ ISR revalidation completed")

        return {
            success: true,
            message: "Settings updated successfully",
            siteUrl: siteUrl,
        }
    } catch (error) {
        console.error("Error while updating settings:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Action pour vérifier la disponibilité d'une URL en temps réel
export async function checkSiteUrlAvailability(siteUrl) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Validation du format
        const urlValidation = validateSiteUrl(siteUrl)
        if (!urlValidation.isValid) {
            return {
                available: false,
                error: urlValidation.error,
            }
        }

        // Vérification de l'unicité
        const uniquenessCheck = await checkSiteUrlUniqueness(siteUrl, userId)

        return {
            available: uniquenessCheck.isUnique,
            error: uniquenessCheck.isUnique ? null : "This URL is already in use.",
        }
    } catch (error) {
        console.error("Error while checking availability:", error)
        return {
            available: false,
            error: error.message,
        }
    }
}

