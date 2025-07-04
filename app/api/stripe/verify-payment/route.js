import { NextResponse } from "next/server"
import { verifyAuthOrRedirect } from "@/lib/auth-utils"
import { stripe } from "@/lib/stripe"
import { updateUserSubscriptionAdmin } from "@/lib/firestore-admin"

export async function POST(request) {
    try {
        console.log("=== VERIFY PAYMENT DEBUG ===")

        // Vérifier l'authentification
        const userId = await verifyAuthOrRedirect()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { sessionId } = await request.json()

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
        }

        console.log("🔍 Verifying payment for session:", sessionId, "user:", userId)

        // Récupérer la session depuis Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        // Vérifier que la session appartient bien à cet utilisateur
        if (session.metadata.userId !== userId) {
            console.error("❌ Session userId mismatch:", session.metadata.userId, "vs", userId)
            return NextResponse.json({ error: "Session does not belong to user" }, { status: 403 })
        }

        // Vérifier que le paiement a réussi
        if (session.payment_status !== "paid") {
            console.log("⚠️ Payment not completed yet:", session.payment_status)
            return NextResponse.json({
                success: false,
                status: session.payment_status,
                message: "Payment not completed yet",
            })
        }

        // Si il y a une souscription, récupérer ses détails
        if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription)
            const priceId = subscription.items.data[0].price.id
            const planType = priceId === process.env.STRIPE_PRICE_YEARLY ? "yearly" : "monthly"

            // Mettre à jour Firestore avec le subscriptionId
            await updateUserSubscriptionAdmin(userId, {
                status: "active",
                plan: planType,
                subscriptionId: session.subscription,
                customerId: session.customer,
                priceId: priceId,
                sessionId: sessionId,
                currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
            })

            console.log("✅ Payment verified and subscription updated for user:", userId)

            return NextResponse.json({
                success: true,
                subscriptionId: session.subscription,
                message: "Payment verified and subscription activated",
            })
        }

        return NextResponse.json({
            success: true,
            message: "Payment verified",
        })
    } catch (error) {
        console.error("❌ Verify payment error:", error)
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
    }
}
