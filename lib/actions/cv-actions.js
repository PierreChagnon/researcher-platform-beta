"use server"

import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"

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
