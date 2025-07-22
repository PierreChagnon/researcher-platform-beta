"use client"

import { useState, useEffect, useTransition } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Calendar, DollarSign, ExternalLink, Loader2, Trash, Ban } from "lucide-react"
import { toast } from "sonner"
import { STRIPE_PRICES } from "@/lib/stripe"
import { useSubscription } from "@/hooks/useSubscription"
import { cancelSubscriptionAction } from "@/lib/actions/stripe-actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BillingPage() {
    const { user, userData, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [portalLoading, setPortalLoading] = useState(false)
    const { subscription, loading: subscriptionLoading, error: subscriptionError, refresh, isActive: subscriptionIsActive } = useSubscription()
    const [isPending, startTransition] = useTransition()

    console.log("use subscription:", subscription)

    // Rediriger si pas connecté
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, router])

    const handleManageSubscription = async () => {
        setPortalLoading(true)
        try {
            const response = await fetch("/api/stripe/customer-portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to create portal session")
            }

            const { url } = await response.json()
            window.location.href = url
        } catch (error) {
            console.error("Error creating portal session:", error)
            toast.error("Failed to open billing portal")
        } finally {
            setPortalLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        startTransition(async () => {
            const res = await cancelSubscriptionAction(user.uid)
            if (res.success) {
                toast.success("Subscription canceled successfully")
            } else {
                toast.error(res.error || "Failed to cancel subscription")
            }
        })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "canceled":
                return <Badge variant="destructive">Canceled</Badge>
            case "past_due":
                return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>
            case "incomplete":
                return <Badge className="bg-orange-100 text-orange-800">Incomplete</Badge>
            case "trialing":
                return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
            default:
                return <Badge variant="secondary">{status || "Unknown"}</Badge>
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A"

        // Gérer les timestamps Firestore ou les dates normales
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    const calculateNextBillingDate = (timestamp, plan) => {
        // Ajouter un mois pour le plan mensuel, un an pour le plan annuel
        const nextBillingDate = new Date(timestamp)
        if (plan === "monthly") {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
        } else if (plan === "yearly") {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
        }

        return nextBillingDate
    }

    const formatAmount = (amount, currency = "eur") => {
        if (!amount) return "N/A"

        // Stripe stocke les montants en centimes
        const actualAmount = amount / 100

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(actualAmount)
    }

    const getPlanName = (priceId) => {
        // Mapper les price IDs aux noms de plans
        if (priceId === STRIPE_PRICES.monthly) {
            return "Monthly"
        }
        if (priceId === STRIPE_PRICES.yearly) {
            return "Yearly"
        }
        return "ResearchSite Pro"
    }

    if (authLoading || subscriptionLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    // Pas d'abonnement trouvé
    if (!subscription || subscription.status !== "pending" || !subscriptionIsActive) {
        console.log(subscription, subscriptionIsActive)
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Billing</h1>
                    <p className="text-muted-foreground">Manage your subscription and billing information</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                            <p className="text-muted-foreground mb-4">
                                You don&apos;t have an active subscription. Subscribe to access all features.
                            </p>
                            <Button onClick={() => router.push("/checkout")}>Subscribe Now</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground">Manage your subscription and billing information</p>
            </div>

            {/* Subscription Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Subscription Status
                    </CardTitle>
                    <CardDescription>Your current subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Status</span>
                        {getStatusBadge(subscription.status)}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="font-medium">Plan</span>
                        <span>{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</span>
                    </div>

                    {subscription.pendingSince && (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Next billing date</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(calculateNextBillingDate(subscription.pendingSince, subscription.plan))}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Manage Subscription */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Subscription</CardTitle>
                    <CardDescription>Update your payment method, download invoices, or cancel your subscription</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div>
                        <Button
                            onClick={handleManageSubscription}
                            disabled={portalLoading || !subscription.customerId}
                            className="w-full sm:w-auto"
                            variant="outline"
                        >
                            {portalLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Opening...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Manage Subscription
                                </>
                            )}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                            You&apos;ll be redirected to Stripe to manage your subscription securely.
                        </p>
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full sm:w-auto" variant="destructive"><Ban className="h-4 w-4 mr-2" />Cancel subscription</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Canceling your subscription will unpublish your website at the end of your current billing period. Your site will no longer be accessible online, but you will still be able to reactivate your subscription and restore your website later if you wish.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild><Button className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60" variant="destructive" onClick={handleCancelSubscription}>{isPending ? "Cancelling..." : "Confirm cancellation"}</Button></AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <p className="text-sm text-muted-foreground mt-2">
                            You can reactivate your subscription later and bring your website back online.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Information */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Billing Information
                    </CardTitle>
                    <CardDescription>Your billing details and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {subscription.customerId && (
                            <p className="text-sm">
                                <span className="font-medium">Customer ID:</span>{" "}
                                <span className="font-mono text-muted-foreground">{subscription.customerId}</span>
                            </p>
                        )}
                        {subscription.subscriptionId && (
                            <p className="text-sm">
                                <span className="font-medium">Subscription ID:</span>{" "}
                                <span className="font-mono text-muted-foreground">{subscription.subscriptionId}</span>
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            For detailed billing history and invoices, use the &quot;Manage Subscription&quot; button above.
                        </p>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}
