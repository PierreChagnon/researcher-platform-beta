"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

// Fonction utilitaire pour vérifier l'auth
async function verifyAuthOrRedirect() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) {
        throw new Error("Not authenticated")
    }

    const decodedToken = await admin.auth.verifyIdToken(token)
    return decodedToken.uid
}

// Fonction pour vérifier l'unicité d'une URL de site
async function checkSiteUrlUniqueness(siteUrl, currentUserId) {
    try {
        const usersRef = admin.db.collection("users")
        const q = usersRef.where("siteSettings.siteUrl", "==", siteUrl)
        const querySnapshot = await q.get()

        if (querySnapshot.empty) {
            return { isUnique: true }
        }

        if (querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === currentUserId) {
            return { isUnique: true }
        }

        return { isUnique: false }
    } catch (error) {
        console.error("Error checking URL uniqueness:", error)
        return { isUnique: false, error: error.message }
    }
}

// Fonction pour valider le format d'une URL de site
function validateSiteUrl(siteUrl) {
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
        return { isValid: false, error: "URL must be between 3 and 30 characters." }
    }

    if (!urlRegex.test(siteUrl)) {
        return {
            isValid: false,
            error: "URL can only contain letters, numbers, and hyphens, and must start and end with a letter or number.",
        }
    }

    if (reservedWords.includes(siteUrl.toLowerCase())) {
        return { isValid: false, error: "This URL is reserved and cannot be used." }
    }

    return { isValid: true }
}

// Update General Settings
export async function updateGeneralSettings(formData) {
    try {
        const userId = await verifyAuthOrRedirect()

        const siteName = formData.get("siteName")
        const siteDescription = formData.get("siteDescription")
        const siteUrl = formData.get("siteUrl")?.toLowerCase().trim()

        // Validation
        if (!siteName || siteName.length < 2) {
            throw new Error("Site name must be at least 2 characters long.")
        }

        if (!siteDescription || siteDescription.length < 10) {
            throw new Error("Site description must be at least 10 characters long.")
        }

        const urlValidation = validateSiteUrl(siteUrl)
        if (!urlValidation.isValid) {
            throw new Error(urlValidation.error)
        }

        const uniquenessCheck = await checkSiteUrlUniqueness(siteUrl, userId)
        if (!uniquenessCheck.isUnique) {
            if (uniquenessCheck.error) {
                throw new Error(`Error checking URL: ${uniquenessCheck.error}`)
            } else {
                throw new Error("This URL is already in use by another researcher.")
            }
        }

        // Get old URL for revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const oldSiteUrl = userDoc.data()?.siteSettings?.siteUrl
        const currentSettings = userDoc.data()?.siteSettings || {}

        // Update only general settings
        const updatedSettings = {
            ...currentSettings,
            siteName,
            siteDescription,
            siteUrl,
            updatedAt: new Date().toISOString(),
        }

        await admin.db.collection("users").doc(userId).update({
            siteSettings: updatedSettings,
        })

        // Revalidation
        if (oldSiteUrl && oldSiteUrl !== siteUrl) {
            revalidatePath(`/sites/${oldSiteUrl}`)
        }
        revalidatePath(`/sites/${siteUrl}`)
        revalidatePath("/dashboard/settings")

        return {
            success: true,
            message: "General settings updated successfully",
            siteUrl: siteUrl,
        }
    } catch (error) {
        console.error("Error updating general settings:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Update Appearance Settings (Theme)
export async function updateAppearanceSettings(formData) {
    try {
        const userId = await verifyAuthOrRedirect()

        const siteTheme = formData.get("siteTheme") || "default"

        // Get current settings
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const currentSettings = userDoc.data()?.siteSettings || {}

        // Update only appearance settings
        const updatedSettings = {
            ...currentSettings,
            siteTheme,
            updatedAt: new Date().toISOString(),
        }

        await admin.db.collection("users").doc(userId).update({
            siteSettings: updatedSettings,
        })

        // Revalidation
        if (currentSettings.siteUrl) {
            revalidatePath(`/sites/${currentSettings.siteUrl}`)
        }
        revalidatePath("/dashboard/settings")

        return {
            success: true,
            message: "Theme updated successfully",
        }
    } catch (error) {
        console.error("Error updating appearance settings:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Update Analytics Settings
export async function updateAnalyticsSettings(formData) {
    try {
        const userId = await verifyAuthOrRedirect()

        const googleAnalyticsId = formData.get("googleAnalyticsId") || ""

        // Get current settings
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const currentSettings = userDoc.data()?.siteSettings || {}

        // Update only analytics settings
        const updatedSettings = {
            ...currentSettings,
            googleAnalyticsId,
            updatedAt: new Date().toISOString(),
        }

        await admin.db.collection("users").doc(userId).update({
            siteSettings: updatedSettings,
        })

        // Revalidation
        if (currentSettings.siteUrl) {
            revalidatePath(`/sites/${currentSettings.siteUrl}`)
        }
        revalidatePath("/dashboard/settings")

        return {
            success: true,
            message: "Analytics settings updated successfully",
        }
    } catch (error) {
        console.error("Error updating analytics settings:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Check URL Availability (unchanged)
export async function checkSiteUrlAvailability(siteUrl) {
    try {
        const userId = await verifyAuthOrRedirect()

        const urlValidation = validateSiteUrl(siteUrl)
        if (!urlValidation.isValid) {
            return {
                available: false,
                error: urlValidation.error,
            }
        }

        const uniquenessCheck = await checkSiteUrlUniqueness(siteUrl, userId)

        return {
            available: uniquenessCheck.isUnique,
            error: uniquenessCheck.isUnique ? null : "This URL is already in use.",
        }
    } catch (error) {
        console.error("Error checking URL availability:", error)
        return {
            available: false,
            error: error.message,
        }
    }
}
