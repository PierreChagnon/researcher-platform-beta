import { NextResponse } from "next/server"
import { createCheckoutSession, STRIPE_PRICES } from "@/lib/stripe"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import admin from "@/lib/firebase-admin"

export async function POST(request) {
    try {
        // Vérifier l'authentification
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer l'email de l'utilisateur
        const userDoc = await admin.db.collection("users").doc(userId).get()
        const userData = userDoc.data()

        if (!userData || !userData.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 400 })
        }

        const userEmail = userData.email

        const { priceType } = await request.json()
        console.log("Price Type:", priceType)

        // Valider le type de prix
        if (!priceType || !STRIPE_PRICES[priceType]) {
            return NextResponse.json({ error: "Invalid price type" }, { status: 400 })
        }

        const priceId = STRIPE_PRICES[priceType]
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

        const successUrl = `${baseUrl}/dashboard?payment=success`
        const cancelUrl = `${baseUrl}/checkout?payment=cancelled`

        const { session, error } = await createCheckoutSession(userId, userEmail, priceId, successUrl, cancelUrl)

        if (error) {
            return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
        }

        return NextResponse.json({ sessionId: session.id })
    } catch (error) {
        console.error("Checkout API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
