import { NextResponse } from "next/server"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import admin from "@/lib/firebase-admin"
import { stripe } from "@/lib/stripe"

export async function GET() {
    console.log("Fetching subscription details...")
    try {
        // Utiliser notre fonction d'authentification standardisée
        const { userId } = await verifyAuthOrRedirect()

        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await admin.db.collection("users").doc(userId).get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const userData = userDoc.data()
        const subscription = userData.subscription
        console.log("User Subscription Data:", subscription)

        if (!subscription) {
            return NextResponse.json({ subscription: null })
        }

        // Enrichir avec les données Stripe si on a un subscriptionId
        let enrichedSubscription = { ...subscription }

        if (subscription.subscriptionId) {
            try {
                const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscriptionId)

                enrichedSubscription = {
                    ...subscription,
                    nextBillingDate: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                    amount: stripeSubscription.items.data[0]?.price?.unit_amount || 0,
                    currency: stripeSubscription.items.data[0]?.price?.currency || "eur",
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                    trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000).toISOString() : null,
                }
            } catch (stripeError) {
                console.error("Error fetching Stripe subscription:", stripeError)
                // On retourne quand même les données Firestore si Stripe échoue
            }
        }
        console.log("Enriched Subscription Data:", enrichedSubscription)
        return NextResponse.json({ subscription: enrichedSubscription })
    } catch (error) {
        console.error("Error fetching subscription:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
