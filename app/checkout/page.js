"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Zap } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

// Centralisation des features
const PLAN_FEATURES = {
    common: ["Custom domain support", "OpenAlex integration", "ORCID Sync", "Analytics dashboard"],
    yearly: ["Same as monthly",],
}

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState("monthly")
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading: authLoading } = useAuth()

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, router])

    // Gérer les messages de retour
    useEffect(() => {
        const payment = searchParams.get("payment")
        if (payment === "cancelled") {
            toast.error("Payment cancelled", {
                description: "You can try again when you're ready.",
            })
        }
    }, [searchParams])

    const handleCheckout = async (priceType) => {
        if (!user) {
            toast.error("Please log in to continue")
            return
        }

        setLoading(true)

        try {
            // Créer la session de checkout
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ priceType }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create checkout session")
            }

            // Rediriger vers Stripe Checkout
            const stripe = await stripePromise
            const { error } = await stripe.redirectToCheckout({
                sessionId: data.sessionId,
            })

            if (error) {
                throw new Error(error.message)
            }
        } catch (error) {
            console.error("Checkout error:", error)
            toast.error("Checkout failed", {
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    // Fonction pour obtenir les features d'un plan
    const getPlanFeatures = (planType) => {
        let features = [...PLAN_FEATURES.common]
        if (planType === "yearly") {
            features = [...PLAN_FEATURES.yearly]
        }
        return features
    }

    // Composant pour afficher les features
    const FeatureList = ({ planType }) => (
        <ul className="space-y-3 mb-6">
            {getPlanFeatures(planType).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                </li>
            ))}
        </ul>
    )

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                    <p className="text-lg text-gray-600">
                        Get access to ResearchSite and create your professional academic website
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {/* Plan mensuel */}
                    <Card className={`relative ${selectedPlan === "monthly" ? "ring-2 ring-blue-500" : ""}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Monthly Plan
                            </CardTitle>
                            <CardDescription>Perfect to get started</CardDescription>
                            <div className="text-3xl font-bold">
                                €{process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY}
                                <span className="text-lg font-normal">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between h-full">
                            <FeatureList planType="monthly" />
                            <Button
                                onClick={() => handleCheckout("monthly")}
                                disabled={loading}
                                className="w-full"
                                variant={selectedPlan === "monthly" ? "default" : "outline"}
                            >
                                {loading ? "Processing..." : "Choose Monthly"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Plan annuel */}
                    <Card className={`relative ${selectedPlan === "yearly" ? "ring-2 ring-blue-500" : ""}`}>
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Save 17%</span>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Yearly Plan
                            </CardTitle>
                            <CardDescription>Best value for committed researchers</CardDescription>
                            <div className="text-3xl font-bold">
                                €{process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY}
                                <span className="text-lg font-normal">/year</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                €{Math.round((process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY / 12) * 100) / 100}/month billed annually
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between h-full">
                            <FeatureList planType="yearly" />
                            <Button
                                onClick={() => handleCheckout("yearly")}
                                disabled={loading}
                                className="w-full"
                                variant={selectedPlan === "yearly" ? "default" : "outline"}
                            >
                                {loading ? "Processing..." : "Choose Yearly"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">Secure payment powered by Stripe. Cancel anytime.</p>
                </div>
            </div>
        </div>
    )
}
