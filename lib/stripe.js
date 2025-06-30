import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
})

// Configuration des prix (à adapter selon tes tarifs)
export const STRIPE_PRICES = {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY, // price_xxx de Stripe
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY, // price_xxx de Stripe
}

// Fonction pour créer une session de checkout
export const createCheckoutSession = async (userId, userEmail, priceId, successUrl, cancelUrl) => {
    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: userEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId,
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                },
            },
        })

        return { session, error: null }
    } catch (error) {
        console.error("Error creating checkout session:", error)
        return { session: null, error: error.message }
    }
}

// Fonction pour récupérer les détails d'un abonnement
export const getSubscription = async (subscriptionId) => {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        return { subscription, error: null }
    } catch (error) {
        console.error("Error retrieving subscription:", error)
        return { subscription: null, error: error.message }
    }
}

// Fonction pour créer un portail de facturation
export const createBillingPortalSession = async (customerId, returnUrl) => {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        })

        return { session, error: null }
    } catch (error) {
        console.error("Error creating billing portal session:", error)
        return { session: null, error: error.message }
    }
}
