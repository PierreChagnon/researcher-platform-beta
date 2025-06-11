"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

export async function syncPublicationsFromOrcid(orcid) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Non authentifié")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Validation ORCID
        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/
        if (!orcidRegex.test(orcid)) {
            throw new Error("Format ORCID invalide")
        }

        // Récupérer les publications depuis OpenAlex
        console.log("Requête OpenAlex pour ORCID:", orcid)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/openalex/author/${orcid}?per_page=100`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Erreur lors de la récupération des publications")
        }

        const { publications } = await response.json()

        if (!publications || publications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "Aucune publication trouvée pour cet ORCID",
            }
        }

        // Sauvegarder dans Firestore
        const batch = admin.db.batch()

        // Supprimer les anciennes publications OpenAlex de cet utilisateur
        const existingPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        existingPublications.docs.forEach((doc) => {
            batch.delete(doc.ref)
        })

        // Ajouter les nouvelles publications
        publications.forEach((publication) => {
            const docRef = admin.db.collection("publications").doc()
            batch.set(docRef, {
                ...publication,
                userId,
                source: "openalex",
                orcid,
                syncedAt: new Date().toISOString(),
                isVisible: true,
                isManual: false,
            })
        })

        await batch.commit()

        // Mettre à jour le profil utilisateur avec la date de dernière sync
        await admin.db.collection("users").doc(userId).update({
            lastOrcidSync: new Date().toISOString(),
            publicationCount: publications.length,
            orcid: orcid, // Sauvegarder l'ORCID dans le profil
        })

        // Revalider les pages qui affichent les publications
        revalidatePath("/dashboard/publications")
        revalidatePath("/site/preview")

        return {
            success: true,
            count: publications.length,
            message: `${publications.length} publications synchronisées avec succès`,
        }
    } catch (error) {
        console.error("Erreur lors de la synchronisation:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function addManualPublication(formData) {
    try {
        // Vérifier l'authentification
        const token = cookies().get("auth-token")?.value
        if (!token) {
            throw new Error("Non authentifié")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Extraire les données du formulaire
        const title = formData.get("title")
        const journal = formData.get("journal")
        const year = formData.get("year")
        const authors = formData.get("authors")
        const doi = formData.get("doi")
        const url = formData.get("url")
        const abstract = formData.get("abstract")

        // Validation
        if (!title || !journal || !year || !authors) {
            throw new Error("Les champs titre, journal, année et auteurs sont obligatoires")
        }

        // Créer la publication
        const publication = {
            title,
            journal,
            year: Number.parseInt(year),
            authors,
            doi: doi || null,
            url: url || null,
            abstract: abstract || null,
            citations: 0,
            type: "article",
            userId,
            source: "manual",
            isVisible: true,
            isManual: true,
            createdAt: new Date().toISOString(),
        }

        // Sauvegarder dans Firestore
        await admin.db.collection("publications").add(publication)

        // Revalider les pages
        revalidatePath("/dashboard/publications")
        revalidatePath("/site/preview")

        return {
            success: true,
            message: "Publication ajoutée avec succès",
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la publication:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
