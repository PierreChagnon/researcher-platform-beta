import { NextResponse } from "next/server"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { stripe } from "@/lib/stripe"
import { getUserSubscription } from "@/lib/firestore"

export async function POST() {
    try {
        // Vérifier l'authentification
        const {userId} = await verifyAuthOrRedirect()

        // Récupérer les informations d'abonnement
        const { subscription } = await getUserSubscription(userId)
        console.log("User Subscription:", subscription)

        if (!subscription?.customerId) {
            return NextResponse.json({ error: "No subscription found" }, { status: 404 })
        }

        console.log("Creating customer portal session for customerId:", subscription.customerId)
        console.log("Return URL:", `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`)

        // Créer une session Customer Portal
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (error) {
        console.error("Error creating customer portal session:", error)
        return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
    }
}
