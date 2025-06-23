"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import admin from "@/lib/firebase-admin"

export async function addTeachingAction(formData) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Extraire les données du formulaire
        const teachingData = {
            semester: formData.get("semester"),
            year: Number.parseInt(formData.get("year")),
            title: formData.get("title"),
            university: formData.get("university"),
            coTeachers: formData.get("coTeachers") || "",
            isAssistant: formData.get("isAssistant") === "on",
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!teachingData.semester || !teachingData.year || !teachingData.title || !teachingData.university) {
            throw new Error("All required fields must be filled")
        }

        // Ajouter à Firestore
        await admin.db.collection("teachings").add(teachingData)

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Teaching added successfully",
        }
    } catch (error) {
        console.error("Error while adding teaching:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function updateTeachingAction(teachingId, formData) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Vérifier que l'enseignement appartient à l'utilisateur
        const teachingDoc = await admin.db.collection("teachings").doc(teachingId).get()

        if (!teachingDoc.exists) {
            throw new Error("Teaching not found")
        }

        const teachingData = teachingDoc.data()
        if (teachingData.userId !== userId) {
            throw new Error("You are not authorized to edit this teaching")
        }

        // Extraire les données du formulaire
        const updatedData = {
            semester: formData.get("semester"),
            year: Number.parseInt(formData.get("year")),
            title: formData.get("title"),
            university: formData.get("university"),
            coTeachers: formData.get("coTeachers") || "",
            isAssistant: formData.get("isAssistant") === "on",
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!updatedData.semester || !updatedData.year || !updatedData.title || !updatedData.university) {
            throw new Error("All required fields must be filled")
        }

        // Mettre à jour dans Firestore
        await admin.db.collection("teachings").doc(teachingId).update(updatedData)

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Teaching updated successfully",
        }
    } catch (error) {
        console.error("Error while updating teaching:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function addGuestLectureAction(formData) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Extraire les données du formulaire
        const lectureData = {
            year: Number.parseInt(formData.get("year")),
            presentationTitle: formData.get("presentationTitle"),
            courseTitle: formData.get("courseTitle"),
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!lectureData.year || !lectureData.presentationTitle || !lectureData.courseTitle) {
            throw new Error("All required fields must be filled")
        }

        // Ajouter à Firestore
        await admin.db.collection("guestLectures").add(lectureData)

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Guest lecture added successfully",
        }
    } catch (error) {
        console.error("Error while adding guest lecture:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function updateGuestLectureAction(lectureId, formData) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Vérifier que la conférence appartient à l'utilisateur
        const lectureDoc = await admin.db.collection("guestLectures").doc(lectureId).get()

        if (!lectureDoc.exists) {
            throw new Error("Guest lecture not found")
        }

        const lectureData = lectureDoc.data()
        if (lectureData.userId !== userId) {
            throw new Error("You are not authorized to edit this guest lecture")
        }

        // Extraire les données du formulaire
        const updatedData = {
            year: Number.parseInt(formData.get("year")),
            presentationTitle: formData.get("presentationTitle"),
            courseTitle: formData.get("courseTitle"),
            updatedAt: new Date().toISOString(),
        }

        // Validation
        if (!updatedData.year || !updatedData.presentationTitle || !updatedData.courseTitle) {
            throw new Error("All required fields must be filled")
        }

        // Mettre à jour dans Firestore
        await admin.db.collection("guestLectures").doc(lectureId).update(updatedData)

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Guest lecture updated successfully",
        }
    } catch (error) {
        console.error("Error while updating guest lecture:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deleteTeachingAction(teachingId) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Vérifier que l'enseignement appartient à l'utilisateur
        const teachingDoc = await admin.db.collection("teachings").doc(teachingId).get()

        if (!teachingDoc.exists) {
            throw new Error("Teaching not found")
        }

        const teachingData = teachingDoc.data()
        if (teachingData.userId !== userId) {
            throw new Error("You are not authorized to delete this teaching")
        }

        // Supprimer l'enseignement
        await admin.db.collection("teachings").doc(teachingId).delete()

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Teaching deleted successfully",
        }
    } catch (error) {
        console.error("Error while deleting teaching:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

export async function deleteGuestLectureAction(lectureId) {
    try {
        // Vérifier l'authentification
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value
        if (!token) {
            throw new Error("Not authenticated")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // Vérifier que la conférence appartient à l'utilisateur
        const lectureDoc = await admin.db.collection("guestLectures").doc(lectureId).get()

        if (!lectureDoc.exists) {
            throw new Error("Guest lecture not found")
        }

        const lectureData = lectureDoc.data()
        if (lectureData.userId !== userId) {
            throw new Error("You are not authorized to delete this guest lecture")
        }

        // Supprimer la conférence
        await admin.db.collection("guestLectures").doc(lectureId).delete()

        // Revalider les pages
        revalidatePath("/dashboard/teaching")

        // Récupérer l'URL du site pour la revalidation
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const siteUrl = userDoc.data()?.siteSettings?.siteUrl
        if (siteUrl) {
            revalidatePath(`/sites/${siteUrl}`)
        }

        return {
            success: true,
            message: "Guest lecture deleted successfully",
        }
    } catch (error) {
        console.error("Error while deleting guest lecture:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}
