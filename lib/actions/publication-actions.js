"use server"

import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"
import { deleteUserPublication } from "@/lib/firestore"
import { FieldValue } from "firebase-admin/firestore"

export async function updatePublicationAction(publicationId, formData) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Vérifier que la publication appartient à l'utilisateur
        const publicationDoc = await admin.db.collection("publications").doc(publicationId).get()

        if (!publicationDoc.exists) {
            throw new Error("Publication not found")
        }

        const publicationData = publicationDoc.data()
        if (publicationData.userId !== userId) {
            throw new Error("You are not authorized to edit this publication")
        }

        // Extraire les données du formulaire
        const updatedData = {
            title: formData.get("title"),
            journal: formData.get("journal"),
            year: Number.parseInt(formData.get("year")),
            doi: formData.get("doi") || "",
            authors: formData.get("authors"),
            url: formData.get("url") || "",
            osfUrl: formData.get("osfUrl") || "",
            abstract: formData.get("abstract") || "",
            updatedAt: new Date().toISOString(),
            type: formData.get("type") || "article", // Default to 'other' if not provided
            supplementaryMaterials: formData.get("supplementaryMaterials") || "",
        }

        // Validation
        if (!updatedData.title || !updatedData.journal || !updatedData.year || !updatedData.authors) {
            throw new Error("All required fields must be filled")
        }

        // Nettoyer les valeurs undefined
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] === undefined || updatedData[key] === null) {
                delete updatedData[key]
            }
        })

        // Mettre à jour dans Firestore
        await admin.db.collection("publications").doc(publicationId).update(updatedData)

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Publication successfully updated",
        }
    } catch (error) {
        console.error("Erreur lors de la modification de la publication:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deletePublicationAction(publicationId) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Utiliser la fonction existante de firestore.js
        const { error } = await deleteUserPublication(publicationId, userId)

        if (error) {
            throw new Error(error)
        }

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        return {
            success: true,
            message: "Publication successfully deleted",
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la publication:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deleteMultiplePublicationsAction(publicationIds) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Supprimer chaque publication
        const results = await Promise.allSettled(
            publicationIds.map(async (publicationId) => {
                const { error } = await deleteUserPublication(publicationId, userId)
                if (error) {
                    throw new Error(`Error for ${publicationId}: ${error}`)
                }
                return publicationId
            }),
        )

        // Compter les succès et échecs
        const successful = results.filter((result) => result.status === "fulfilled").length
        const failed = results.filter((result) => result.status === "rejected").length

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        if (failed > 0) {
            return {
                success: false,
                error: `${successful} publication(s) deleted, ${failed} failed`,
            }
        }

        return {
            success: true,
            message: `${successful} publication(s) successfully deleted`,
        }
    } catch (error) {
        console.error("Erreur lors de la suppression multiple:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function uploadPublicationPDF(publicationId, file) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Vérifier que la publication appartient à l'utilisateur
        const publicationDoc = await admin.db.collection("publications").doc(publicationId).get()

        if (!publicationDoc.exists) {
            throw new Error("Publication not found")
        }

        const publicationData = publicationDoc.data()
        if (publicationData.userId !== userId) {
            throw new Error("You are not authorized to edit this publication")
        }

        // Vérifier le type de fichier
        if (!file.type.includes("pdf")) {
            throw new Error("Only PDF files are accepted")
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            throw new Error("The file cannot exceed 10MB")
        }

        // Convertir le fichier en buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Créer un nom de fichier unique avec timestamp
        const timestamp = Date.now()
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const fileName = `publications/${userId}/${publicationId}/${timestamp}_${sanitizedFileName}`

        // Upload vers Firebase Storage
        const bucket = admin.storage.bucket()
        const fileRef = bucket.file(fileName)

        // Upload le fichier
        await fileRef.save(buffer, {
            metadata: {
                contentType: "application/pdf",
                metadata: {
                    userId: userId,
                    publicationId: publicationId,
                    originalName: file.name,
                    uploadedAt: new Date().toISOString(),
                },
            },
        })

        // Rendre le fichier accessible publiquement
        await fileRef.makePublic()

        // Obtenir l'URL publique
        const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

        // Mettre à jour la publication avec l'URL du PDF
        await admin.db.collection("publications").doc(publicationId).update({
            pdfUrl: pdfUrl,
            pdfFileName: file.name,
            pdfStoragePath: fileName,
            pdfUploadedAt: new Date().toISOString(),
        })

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "PDF uploaded successfully",
            pdfUrl: pdfUrl,
        }
    } catch (error) {
        console.error("Erreur lors de l'upload du PDF:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deletePublicationPDF(publicationId) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer la publication
        const publicationDoc = await admin.db.collection("publications").doc(publicationId).get()

        if (!publicationDoc.exists) {
            throw new Error("Publication not found")
        }

        const publicationData = publicationDoc.data()
        if (publicationData.userId !== userId) {
            throw new Error("You are not authorized to edit this publication")
        }

        // Supprimer le fichier de Storage si il existe
        if (publicationData.pdfStoragePath) {
            const bucket = admin.storage.bucket()
            const fileRef = bucket.file(publicationData.pdfStoragePath)

            try {
                await fileRef.delete()
            } catch (error) {
                console.warn("Erreur lors de la suppression du fichier Storage:", error)
                // Continue même si la suppression échoue
            }
        }

        // Mettre à jour la publication pour retirer les infos PDF
        await admin.db.collection("publications").doc(publicationId).update({
            pdfUrl: FieldValue.delete(),
            pdfFileName: FieldValue.delete(),
            pdfStoragePath: FieldValue.delete(),
            pdfUploadedAt: FieldValue.delete(),
        })

        // Revalider les pages
        revalidatePath("/dashboard/publications")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "PDF successfully deleted",
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du PDF:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
