import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateUserSubscription } from "@/lib/firestore"

// Ne PAS utiliser le body parser de Next (important pour Stripe)
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event

    try {
        // Vérifier la signature du webhook
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        console.error("Webhook signature verification failed:", error)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object
                const userId = session.metadata.userId
                const subscriptionId = session.subscription

                if (userId && subscriptionId) {
                    await updateUserSubscription(userId, {
                        subscriptionId: subscriptionId,
                        subscriptionStatus: "active",
                        customerId: session.customer,
                        updatedAt: new Date().toISOString(),
                    })
                    console.log(`Subscription activated for user ${userId}`)
                }
                break

            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                const subscription = event.data.object
                const customerSubscription = await stripe.subscriptions.retrieve(subscription.id)
                const userIdFromSub = customerSubscription.metadata.userId

                if (userIdFromSub) {
                    await updateUserSubscription(userIdFromSub, {
                        subscriptionStatus: subscription.status,
                        updatedAt: new Date().toISOString(),
                    })
                    console.log(`Subscription ${subscription.status} for user ${userIdFromSub}`)
                }
                break

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Webhook processing error:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}
