"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import admin from "@/lib/firebase-admin"

export async function verifyAuthOrRedirect() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            redirect("/login")
        }

        const decodedToken = await admin.auth.verifyIdToken(token)
        return { success: true, userId: decodedToken.uid }
    } catch (error) {
        console.error("Token verification failed:", error)

        // Si le token a expiré, supprimer le cookie et rediriger
        if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
            const cookieStore = await cookies()
            cookieStore.delete("auth-token")
            redirect("/login")
        }

        throw error
    }
}
