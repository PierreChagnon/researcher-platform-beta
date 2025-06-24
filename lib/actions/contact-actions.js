"use server"

import { revalidatePath } from "next/cache"
import { updateUserContact } from "@/lib/firestore"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import admin from "@/lib/firebase-admin"

export async function updateContactAction(formData) {
    try {
        // Vérifier l'authentification (redirige automatiquement si expiré)
        const { userId } = await verifyAuthOrRedirect()

        // Extraire les données du formulaire
        const email = formData.get("email")
        const phone = formData.get("phone")
        const address = formData.get("address")

        // Validation basique
        if (!email || !email.includes("@")) {
            throw new Error("Valid email is required")
        }

        const contactData = {
            email: email.trim(),
            phone: phone?.trim() || "",
            address: address?.trim() || "",
            updatedAt: new Date().toISOString(),
        }

        // Mettre à jour dans Firestore
        const result = await updateUserContact(userId, contactData)

        if (result.error) {
            throw new Error(result.error)
        }

        // Revalider la page dashboard
        revalidatePath("/dashboard/contact")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Contact information updated successfully",
        }
    } catch (error) {
        console.error("Error updating contact:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
