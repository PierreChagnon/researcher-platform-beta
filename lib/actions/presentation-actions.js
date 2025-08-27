"use server"

import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"

export async function addPresentationAction(formData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Extraire les données du formulaire
        const presentationData = {
            conferenceName: formData.get("conferenceName"),
            title: formData.get("title"),
            category: formData.get("category"),
            coAuthors: formData.get("coAuthors") || "",
            location: formData.get("location"),
            date: formData.get("date"),
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!presentationData.title || !presentationData.category || !presentationData.location || !presentationData.date) {
            throw new Error("All required fields must be filled")
        }

        // Ajouter à Firestore
        await admin.db.collection("presentations").add(presentationData)

        // Revalider les pages
        revalidatePath("/dashboard/presentations")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Presentation added successfully",
        }
    } catch (error) {
        console.error("Error while adding the presentation:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function updatePresentationAction(presentationId, formData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Vérifier que la présentation appartient à l'utilisateur
        const presentationDoc = await admin.db.collection("presentations").doc(presentationId).get()

        if (!presentationDoc.exists) {
            throw new Error("Presentation not found")
        }

        const presentationData = presentationDoc.data()
        if (presentationData.userId !== userId) {
            throw new Error("You are not authorized to edit this presentation")
        }

        // Extraire les données du formulaire
        const updatedData = {
            conferenceName: formData.get("conferenceName"),
            title: formData.get("title"),
            category: formData.get("category"),
            coAuthors: formData.get("coAuthors") || "",
            location: formData.get("location"),
            date: formData.get("date"),
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!updatedData.title || !updatedData.category || !updatedData.location || !updatedData.date) {
            throw new Error("All required fields must be filled")
        }

        // Mettre à jour dans Firestore
        await admin.db.collection("presentations").doc(presentationId).update(updatedData)

        // Revalider les pages
        revalidatePath("/dashboard/presentations")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Presentation updated successfully",
        }
    } catch (error) {
        console.error("Error while updating the presentation:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deletePresentationAction(presentationId) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Vérifier que la présentation appartient à l'utilisateur
        const presentationDoc = await admin.db.collection("presentations").doc(presentationId).get()

        if (!presentationDoc.exists) {
            throw new Error("Presentation not found")
        }

        const presentationData = presentationDoc.data()
        if (presentationData.userId !== userId) {
            throw new Error("You are not authorized to delete this presentation")
        }

        // Supprimer la présentation
        await admin.db.collection("presentations").doc(presentationId).delete()

        // Revalider les pages
        revalidatePath("/dashboard/presentations")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Presentation deleted successfully",
        }
    } catch (error) {
        console.error("Error while deleting the presentation:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
