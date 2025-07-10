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

        // Récupérer le customerId de l'utilisateur
        if (!userData.subscription || !userData.subscription.customerId) {
            return NextResponse.json({ error: "User does not have a Stripe customer ID" },
                { status: 400 }
            )
        }
        const customerId = userData.subscription.customerId

        const { priceType } = await request.json()
        console.log("Price Type:", priceType)

        // Valider le type de prix
        if (!priceType || !STRIPE_PRICES[priceType]) {
            return NextResponse.json({ error: "Invalid price type" }, { status: 400 })
        }

        const priceId = STRIPE_PRICES[priceType]
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

        const { session, error } = await createCheckoutSession(userId, userEmail, priceId, customerId)
        console.log("Checkout Session:", session)

        if (error) {
            return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
        }

        // Mise à jour préventive dans Firestore (contourne le webhook a la premiere création de session)
        try {
            const planType = priceId === process.env.STRIPE_PRICE_YEARLY ? "yearly" : "monthly"

            await admin.db
                .collection("users")
                .doc(userId)
                .update({
                    subscription: {
                        status: "pending",
                        plan: planType,
                        sessionId: session.id,
                        pendingSince: new Date().toISOString(),
                        subscriptionId: session.subscription || null,
                        subscriptionStatus: "active",
                        customerId: customerId,
                    },
                })

            console.log("✅ Subscription status updated to pending for user:", userId)
        } catch (firestoreError) {
            console.error("⚠️ Failed to update Firestore (non-critical):", firestoreError)
            // On ne fait pas échouer la création de session pour ça
        }
        return NextResponse.json({ sessionId: session.id })
    } catch (error) {
        console.error("Checkout API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
