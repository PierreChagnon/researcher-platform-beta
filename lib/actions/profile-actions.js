"use server"

import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

export async function updateUserProfileWithRevalidation(profileData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        // 🎯 Nettoyer les données pour éviter les valeurs undefined
        const cleanProfileData = {}

        // Champs obligatoires
        if (profileData.name) cleanProfileData.name = profileData.name
        if (profileData.title) cleanProfileData.title = profileData.title
        if (profileData.institution) cleanProfileData.institution = profileData.institution
        if (profileData.email) cleanProfileData.email = profileData.email
        if (profileData.bio) cleanProfileData.bio = profileData.bio
        if (profileData.orcid) cleanProfileData.orcid = profileData.orcid

        // Champs optionnels
        if (profileData.hIndex !== undefined && profileData.hIndex !== "") {
            cleanProfileData.hIndex = Number.parseInt(profileData.hIndex) || 0
        }

        // Réseaux sociaux - ne sauvegarder que les champs remplis
        const social = {}
        if (profileData.twitter) social.twitter = profileData.twitter
        if (profileData.bluesky) social.bluesky = profileData.bluesky
        if (profileData.researchgate) social.researchgate = profileData.researchgate
        if (profileData.osf) social.osf = profileData.osf
        if (profileData.googlescholar) social.googlescholar = profileData.googlescholar

        // N'ajouter social que s'il y a au moins un réseau
        if (Object.keys(social).length > 0) {
            cleanProfileData.social = social
        }

        // Ajouter la date de mise à jour
        cleanProfileData.updatedAt = new Date().toISOString()

        console.log("🔄 Data to save:", cleanProfileData)

        // Mettre à jour le profil dans Firestore
        await admin.db.collection("users").doc(userId).update(cleanProfileData)

        // 🎯 REVALIDATION ISR du site du chercheur
        if (siteUrl) {
            console.log("🔄 ISR revalidation profile for:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ ISR profile revalidation complete")
        }

        // Revalider aussi les pages du dashboard
        revalidatePath("/dashboard/profile")
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Profile updated successfully",
        }
    } catch (error) {
        console.error("Error updating profile:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

