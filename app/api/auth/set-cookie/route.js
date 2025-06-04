import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: "Token manquant" }, { status: 400 })
        }

        // Définir le cookie avec le token
        // Sécurisé, HttpOnly, et SameSite=Strict pour la sécurité
        cookies().set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            path: "/",
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
