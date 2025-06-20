"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { fetchPublicationsFromOrcid } from "@/lib/openalex"

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

        console.log("Synchronisation ORCID pour utilisateur:", userId, "ORCID:", orcid)

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        // Récupérer les publications depuis OpenAlex (appel direct)
        const { publications } = await fetchPublicationsFromOrcid(orcid, { perPage: 100 })

        if (!publications || publications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "Aucune publication trouvée pour cet ORCID",
            }
        }

        console.log(`${publications.length} publications récupérées depuis OpenAlex`)

        // Sauvegarder dans Firestore
        const batch = admin.db.batch()

        // Supprimer les anciennes publications OpenAlex de cet utilisateur
        const existingPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        console.log(`Suppression de ${existingPublications.docs.length} anciennes publications`)

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
            orcid: orcid,
        })

        // 🎯 REVALIDATION ISR du site du chercheur
        if (siteUrl) {
            console.log("🔄 Revalidation ISR publications pour:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ Revalidation ISR publications terminée")
        }

        // Revalider les pages qui affichent les publications
        revalidatePath("/dashboard/publications")

        console.log("Synchronisation terminée avec succès")

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
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Non authentifié")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

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

        // 🎯 REVALIDATION ISR du site du chercheur
        if (siteUrl) {
            console.log("🔄 Revalidation ISR nouvelle publication pour:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ Revalidation ISR nouvelle publication terminée")
        }

        // Revalider les pages
        revalidatePath("/dashboard/publications")

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
