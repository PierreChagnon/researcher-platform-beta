import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        // Supprimer le cookie d'authentification
        const cookieStore = await cookies()
        cookieStore.delete("auth-token")

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
