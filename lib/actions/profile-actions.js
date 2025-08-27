"use server"

import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export async function updateUserProfileWithRevalidation(profileData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        // 🎯 Nettoyer les données pour éviter les valeurs undefined
        const cleanProfileData = {}

        // Champs obligatoires (celles qui n'ont pas de condition ne seront plus obligatoires)
        // (les if servent à vérifier si la valeur existe avant de l'assigner, donc si pas de valeur, pas d'assignation)
        if (profileData.name) cleanProfileData.name = profileData?.name // obligatoire
        if (profileData.title) cleanProfileData.title = profileData?.title // obligatoire
        cleanProfileData.institution = profileData?.institution
        cleanProfileData.email = profileData?.email
        cleanProfileData.bio = profileData?.bio
        cleanProfileData.orcid = profileData?.orcid

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

export async function updateProfilePicture(file) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Vérifier que le fichier est une image
        if (!file || !file.type.startsWith("image/")) {
            throw new Error("Invalid file type. Please upload an image.")
        }

        const bucket = admin.storage.bucket()

        // On supprime les anciennes images
        const [files] = await bucket.getFiles({ prefix: `profile-pictures/${userId}/` })
        const deletePromises = files.map((file) => file.delete())
        await Promise.all(deletePromises)

        // Enregistrer l'image dans Firebase Storage
        const fileName = `profile-pictures/${userId}/profile-picture_${Date.now()}`
        const fileUpload = bucket.file(fileName)

        // Convertir le fichier en buffer pour l'envoi
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        await fileUpload.save(buffer, {
            contentType: file.type,
            public: true,
            metadata: {
                cacheControl: "no-cache, no-store, must-revalidate, max-age=0", // faible cache pour que l'url soit revalidée à chaque fois dans le dashboard
                metadata: { userId, kind: "profilePicture" },
            },
        })

        // Rendre le fichier public
        await fileUpload.makePublic()

        // Mettre à jour l'URL de la photo de profil dans Firestore
        const profilePictureUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
        await admin.db.collection("users").doc(userId).update({
            profilePictureUrl: profilePictureUrl,
            updatedAt: new Date().toISOString(),
        })

        // Revalider les pages du dashboard
        revalidatePath("/dashboard/profile")
        revalidatePath("/dashboard")

        // Revalider le site du chercheur
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            profilePictureUrl,
            message: "Profile picture updated successfully",
        }
    } catch (error) {
        console.error("Error updating profile picture:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deleteProfilePicture() {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer l'URL actuelle de la photo de profil
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const profilePictureUrl = userDoc.data()?.profilePictureUrl

        if (!profilePictureUrl) {
            throw new Error("No profile picture to delete.")
        }

        // On supprime les anciennes images
        const bucket = admin.storage.bucket()
        const [files] = await bucket.getFiles({ prefix: `profile-pictures/${userId}/` })
        const deletePromises = files.map((file) => file.delete())
        await Promise.all(deletePromises)

        // Mettre à jour Firestore pour supprimer l'URL de la photo de profil
        await admin.db.collection("users").doc(userId).update({
            profilePictureUrl: FieldValue.delete(),
            updatedAt: new Date().toISOString(),
        })

        // Revalider les pages du dashboard
        revalidatePath("/dashboard/profile")
        revalidatePath("/dashboard")

        // Revalider le site du chercheur
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Profile picture deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting profile picture:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

