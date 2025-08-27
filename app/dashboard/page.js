"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Settings, User, ExternalLink, BarChart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPublications } from "@/lib/firestore"
import { useSearchParams } from "next/navigation"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export default function DashboardPage() {
    const { user, userData, loading } = useAuth()
    const [publications, setPublications] = useState([])
    const [publicationsLoading, setPublicationsLoading] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Vérifier l'authentification côté client
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login")
                return
            }
        }
    }, [user, loading, router])

    // Gérer les messages de retour de Stripe avec Sonner
    useEffect(() => {
        const paymentParam = searchParams.get("payment")
        const sessionId = searchParams.get("session_id")

        if (paymentParam === "success" && sessionId) {
            console.log("✅ Payment success detected - webhook will handle activation")

            // Toast de succès avec Sonner
            toast.success("Payment successful!", {
                description: "Your subscription is being activated. This may take a few moments.",
                duration: 6000,
                action: {
                    label: "Refresh",
                    onClick: () => window.location.reload(),
                },
            })

            // Nettoyer l'URL après affichage du toast
            setTimeout(() => {
                const url = new URL(window.location)
                url.searchParams.delete("payment")
                url.searchParams.delete("session_id")
                window.history.replaceState({}, "", url)
            }, 1000)
        } else if (paymentParam === "cancelled") {
            toast.error("Payment cancelled", {
                description: "You can try again anytime from your billing settings.",
                duration: 4000,
            })

            // Nettoyer l'URL
            setTimeout(() => {
                const url = new URL(window.location)
                url.searchParams.delete("payment")
                window.history.replaceState({}, "", url)
            }, 1000)
        }
    }, [searchParams])

    useEffect(() => {
        const fetchPublications = async () => {
            if (user) {
                try {
                    const { publications: userPubs } = await getUserPublications(user.uid)
                    setPublications(userPubs)
                } catch (error) {
                    console.error("Error fetching publications:", error)
                } finally {
                    setPublicationsLoading(false)
                }
            }
        }

        fetchPublications()
    }, [user])

    const getProfileCompleteness = () => {
        if (!userData) return 0

        const fields = ["title", "institution", "bio", "orcid"]
        const completedFields = fields.filter((field) => userData[field] && userData[field].trim() !== "")
        return Math.round((completedFields.length / fields.length) * 100)
    }

    const siteUrl = userData?.siteSettings?.siteUrl || "your-site"

    // Afficher un loading pendant la vérification d'auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // Si pas d'utilisateur après le loading, ne rien afficher (redirection en cours)
    if (!user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome {userData?.name || user?.displayName}, to your ResearchSite dashboard.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{publicationsLoading ? "..." : publications.length}</div>
                        <p className="text-xs text-muted-foreground">Publications in your database</p>
                        <Button variant="link" className="px-0 mt-2" asChild>
                            <Link href="/dashboard/publications">Manage publications</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Site visits</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Coming soon</div>
                        <p className="text-xs text-muted-foreground">Analytics under development</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getProfileCompleteness()}%</div>
                        <p className="text-xs text-muted-foreground">Your profile completeness</p>
                        <Button variant="link" className="px-0 mt-2" asChild>
                            <Link href="/dashboard/profile">Complete my profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick actions</CardTitle>
                        <CardDescription>Quickly access main features</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Update my profile</p>
                                <p className="text-sm text-muted-foreground">
                                    Edit your personal and professional information
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="min-w-28" asChild>
                                <Link href="/dashboard/profile">Edit</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <FileText className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Manage my publications</p>
                                <p className="text-sm text-muted-foreground">View and organize your scientific publications</p>
                            </div>
                            <Button size="sm" variant="outline" className="min-w-28" asChild>
                                <Link href="/dashboard/publications">Manage</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Settings className="h-5 w-5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Site settings</p>
                                <p className="text-sm text-muted-foreground">
                                    Customize the appearance and content of your site
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="min-w-28" asChild>
                                <Link href="/dashboard/settings">Configure</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Your website</CardTitle>
                        <CardDescription>Preview and manage your researcher website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border bg-muted/50 p-4">
                            <div className="text-sm font-medium">Your site URL</div>
                            <div className="mt-1 flex items-center gap-2">
                                <code className="rounded bg-muted px-2 py-1 text-sm">
                                    {siteUrl}.{DOMAIN}
                                </code>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <span className="sr-only">Copy URL</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-copy"
                                    >
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/settings">Customize</Link>
                            </Button>
                            <Button asChild>
                                <Link href={`https://${siteUrl}.${DOMAIN}`} target="_blank" className="flex items-center gap-2">
                                    <span>View my site</span>
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}