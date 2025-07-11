"use server"

import Stripe from "stripe"
import admin from "@/lib/firebase-admin"

// Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
})

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

export async function cancelSubscriptionAction(userId) {
    // 1. Récupérer le customerId dans Firestore
    const userDoc = await admin.db.collection("users").doc(userId).get()
    const user = userDoc.data()
    const customerId = user.subscription.customerId
    if (!customerId) return { success: false, error: "Aucun customer Stripe trouvé." }

    console.log("Customer ID:", customerId)
    // 2. Trouver l’abonnement actif du customer
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
    })
    console.log("Active subscriptions:", subscriptions.data)
    if (!subscriptions.data.length) return { success: false, error: "Aucun abonnement actif." }
    const subscriptionId = subscriptions.data[0].id

    // 3. Annuler l’abonnement (fin de période)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
    })

    // 4. Mettre à jour Firestore
    await admin.db.collection("users").doc(userId).update({
        "subscription.status": "canceled",
        "subscription.canceledAt": new Date().toISOString(),
    })

    return { success: true }
}