"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { deletePublication } from "@/lib/firestore"

export async function deletePublicationAction(publicationId) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Non authentifié")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid // si on veut ajouter une vérification de l'utilisateur

        // Utiliser la fonction existante de firestore.js
        const { error } = await deletePublication(publicationId)

        if (error) {
            throw new Error(error)
        }

        // Revalider les pages
        revalidatePath("/dashboard/publications")
        revalidatePath("/site/preview")

        return {
            success: true,
            message: "Publication supprimée avec succès",
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la publication:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
