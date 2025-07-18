import Stripe from "stripe"

if (typeof window === "undefined" && !process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
}

// Initialiser Stripe seulement côté serveur
export const stripe =
    typeof window === "undefined"
        ? new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2023-10-16",
        })
        : null

// Configuration des prix (à adapter selon tes tarifs)
export const STRIPE_PRICES = {
    monthly: process.env.STRIPE_PRICE_MONTHLY, // price_xxx de Stripe
    yearly: process.env.STRIPE_PRICE_YEARLY, // price_xxx de Stripe
}

// Fonction pour créer une session de checkout
export const createCheckoutSession = async (userId, userEmail, priceId, customerId) => {
    if (!stripe) {
        throw new Error("Stripe can only be used server-side")
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${baseUrl}/billing-success`,
            cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
            metadata: {
                userId: userId,
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                },
            },
        })
        console.log("Checkout session created:", session.id)
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

// Fonction pour créer un client Stripe (utilisée lors de l'inscription)
export const createStripeCustomer = async (email, name) => {
    if (!stripe) {
        throw new Error("Stripe can only be used server-side")
    }

    try {
        const customer = await stripe.customers.create({
            email,
            name,
        })
        console.log("Stripe customer created:", customer.id)
        return { customerId: customer.id, error: null }
    } catch (error) {
        console.error("Error creating Stripe customer:", error)
        return { customerId: null, error: error.message }
    }
}
