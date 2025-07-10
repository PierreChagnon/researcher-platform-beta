"use server"

import Stripe from "stripe"

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