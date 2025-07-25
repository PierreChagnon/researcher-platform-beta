"use server"

import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

export async function updateCvData(formData) {
    try {
        const { userId, error: authError } = await verifyAuthOrRedirect()

        if (authError) return { error: authError }

        const cvData = {
            // Academic Positions
            positions: JSON.parse(formData.get("positions") || "[]"),

            // Education
            education: JSON.parse(formData.get("education") || "[]"),

            // Research Funding & Awards
            funding: JSON.parse(formData.get("funding") || "[]"),
            awards: JSON.parse(formData.get("awards") || "[]"),

            // Reviewing Activities
            reviewing: JSON.parse(formData.get("reviewing") || "[]"),

            // Expertise & Evaluation
            expertise: JSON.parse(formData.get("expertise") || "[]"),

            // Additional sections
            languages: JSON.parse(formData.get("languages") || "[]"),
            skills: JSON.parse(formData.get("skills") || "[]"),

            updatedAt: new Date().toISOString(),
        }

        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, { cvData })

        return { success: true }
    } catch (error) {
        console.error("Error updating CV data:", error)
        return { error: "Failed to update CV data" }
    }
}

export async function getCvData(uid) {
    try {
        const userRef = doc(db, "users", uid)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            return { cvData: null, error: "User not found" }
        }

        const userData = userDoc.data()
        return { cvData: userData.cvData || {}, error: null }
    } catch (error) {
        console.error("Error fetching CV data:", error)
        return { cvData: null, error: error.message }
    }
}

export async function uploadCvAction(file) {
    console.log("uploadCvAction called with file:", file)
    try {
        const { userId, error: authError } = await verifyAuthOrRedirect()

        if (authError) return { error: authError }

        if (!file) {
            return { error: "No file provided" }
        }

        const bucket = admin.storage.bucket()
        const fileName = `cv/${userId}/${file.name}`
        const fileUpload = bucket.file(fileName)

        // Pour utiliser avec bucket.file().save(), il faut lire le contenu en buffer :
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        await fileUpload.save(buffer, {
            contentType: file.type,
            resumable: false,
        })

        // Make the file public
        await fileUpload.makePublic()

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

        // Update user's CV URL in Firestore
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, { cvUrl: publicUrl })

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return { success: true, url: publicUrl }
    } catch (error) {
        console.error("Error uploading CV:", error)
        return { error: "Failed to upload CV" }
    }
}

export async function removeCvAction() {
    try {
        const { userId, error: authError } = await verifyAuthOrRedirect()

        if (authError) return { error: authError }

        const bucket = admin.storage.bucket();
        const folderPath = `cv/${userId}/`;

        // Lister tous les fichiers du "dossier"
        const [files] = await bucket.getFiles({ prefix: folderPath });

        if (files.length === 0) {
            return { success: true, message: "No files to delete in folder." };
        }

        // Supprimer chaque fichier du dossier
        await Promise.all(files.map(file => file.delete()));

        // Remove CV URL from Firestore
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, { cvUrl: null })

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return { success: true }
    } catch (error) {
        console.error("Error removing CV:", error)
        return { error: "Failed to remove CV" }
    }
}