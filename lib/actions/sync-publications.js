"use server"

import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { fetchPublicationsFromOrcid } from "@/lib/openalex"

export async function fetchPublicationsPreview(orcid) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        console.log("Fetching ORCID preview for user:", userId, "ORCID:", orcid)

        // Récupérer les publications depuis OpenAlex (appel direct)
        const { publications } = await fetchPublicationsFromOrcid(orcid, { perPage: 100 })

        if (!publications || publications.length === 0) {
            return {
                success: true,
                publications: [],
                message: "No publications found for this ORCID",
            }
        }

        console.log(`${publications.length} publications fetched from OpenAlex for preview`)

        // Récupérer les publications déjà existantes pour éviter les doublons
        const existingPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        const existingDois = new Set()
        const existingTitles = new Set()

        existingPublications.docs.forEach((doc) => {
            const data = doc.data()
            if (data.doi) existingDois.add(data.doi)
            if (data.title) existingTitles.add(data.title.toLowerCase())
        })

        // Marquer les publications déjà existantes
        const publicationsWithStatus = publications.map((pub) => ({
            ...pub,
            alreadyExists:
                (pub.doi && existingDois.has(pub.doi)) || (pub.title && existingTitles.has(pub.title.toLowerCase())),
            selected: true, // Selected by default
        }))

        return {
            success: true,
            publications: publicationsWithStatus,
            message: `${publications.length} publications found`,
        }
    } catch (error) {
        console.error("Error while fetching preview:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function syncSelectedPublications(orcid, selectedPublications) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        console.log("Syncing selected publications for user:", userId)

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        if (!selectedPublications || selectedPublications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "No publication selected",
            }
        }

        console.log(`${selectedPublications.length} publications selected for sync`)

        // Récupérer les publications déjà existantes pour éviter les vrais doublons
        const existingPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        const existingDois = new Set()
        const existingTitles = new Set()

        existingPublications.docs.forEach((doc) => {
            const data = doc.data()
            if (data.doi) existingDois.add(data.doi)
            if (data.title) existingTitles.add(data.title.toLowerCase())
        })

        // Filtrer les publications vraiment nouvelles
        const newPublications = selectedPublications.filter((pub) => {
            const isDuplicate =
                (pub.doi && existingDois.has(pub.doi)) || (pub.title && existingTitles.has(pub.title.toLowerCase()))
            return !isDuplicate
        })

        console.log(
            `${newPublications.length} new publications to add (${selectedPublications.length - newPublications.length} duplicates avoided)`,
        )

        if (newPublications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "No new publication to add (all are already present)",
            }
        }

        // Sauvegarder dans Firestore - SEULEMENT les nouvelles
        const batch = admin.db.batch()

        newPublications.forEach((publication) => {
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
        // Compter le total de publications OpenAlex après ajout
        const totalPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        await admin.db.collection("users").doc(userId).update({
            lastOrcidSync: new Date().toISOString(),
            publicationCount: totalPublications.docs.length,
            orcid: orcid,
        })

        // 🎯 REVALIDATION ISR du site du chercheur
        if (siteUrl) {
            console.log("🔄 ISR revalidation publications for:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ ISR revalidation publications done")
        }

        // Revalider les pages qui affichent les publications
        revalidatePath("/dashboard/publications")

        console.log("Sync completed successfully")

        return {
            success: true,
            count: newPublications.length,
            message: `${newPublications.length} new publications successfully synced`,
        }
    } catch (error) {
        console.error("Error while syncing:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function syncPublicationsFromOrcid(orcid) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        console.log("Syncing ORCID for user:", userId, "ORCID:", orcid)

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        // Récupérer les publications depuis OpenAlex (appel direct)
        const { publications } = await fetchPublicationsFromOrcid(orcid, { perPage: 100 })

        if (!publications || publications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "No publications found for this ORCID",
            }
        }

        console.log(`${publications.length} publications fetched from OpenAlex`)

        // Sauvegarder dans Firestore
        const batch = admin.db.batch()

        // Supprimer les anciennes publications OpenAlex de cet utilisateur
        const existingPublications = await admin.db
            .collection("publications")
            .where("userId", "==", userId)
            .where("source", "==", "openalex")
            .get()

        console.log(`Deleting ${existingPublications.docs.length} old publications`)

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
                category: "Journal Article", // Par défaut, peut être ajusté
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
            console.log("🔄 ISR revalidation publications for:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ ISR revalidation publications done")
        }

        // Revalider les pages qui affichent les publications
        revalidatePath("/dashboard/publications")

        console.log("Sync completed successfully")

        return {
            success: true,
            count: publications.length,
            message: `${publications.length} publications successfully synced`,
        }
    } catch (error) {
        console.error("Error while syncing:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function addManualPublication(formData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl

        // Extraire les données du formulaire
        const title = formData.get("title")
        const journal = formData.get("journal")
        const category = formData.get("category")
        const year = formData.get("year")
        const authors = formData.get("authors")
        const doi = formData.get("doi")
        const url = formData.get("url")
        const abstract = formData.get("abstract")

        // Validation
        if (!title || !journal || !year || !authors) {
            throw new Error("Title, journal, year, and authors fields are required")
        }

        // Créer la publication
        const publication = {
            title,
            journal,
            year: Number.parseInt(year),
            category,
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
            console.log("🔄 ISR revalidation new publication for:", siteUrl)
            revalidatePath(`/sites/${siteUrl}`)
            console.log("✅ ISR revalidation new publication done")
        }

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        return {
            success: true,
            message: "Publication added successfully",
        }
    } catch (error) {
        console.error("Error while adding publication:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
