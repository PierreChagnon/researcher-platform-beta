import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import admin from "@/lib/firebase-admin"

// Cette route peut être utilisée pour vérifier la validité du token côté serveur
export async function GET() {
    try {
        const token = cookies().get("auth-token")?.value

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        // Vérifier le token avec Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token)

        return NextResponse.json({
            authenticated: true,
            uid: decodedToken.uid,
            email: decodedToken.email,
        })
    } catch (error) {
        // Si le token est invalide ou expiré
        cookies().delete("auth-token")
        return NextResponse.json({ authenticated: false, error: error.message }, { status: 401 })
    }
}
